import * as THREE from 'three';
import { Player } from './Player';
import { Crosshair } from './Crosshair';

export class Controls {
  private keys: { [key: string]: boolean } = {};
  private mouse: { x: number; y: number } = { x: 0, y: 0 };
  private player: Player;
  private camera: THREE.PerspectiveCamera;
  private canvas: HTMLCanvasElement;
  private crosshair: Crosshair | null = null;
  private isMouseLocked: boolean = false;

  constructor(player: Player, camera: THREE.PerspectiveCamera, canvas: HTMLCanvasElement) {
    this.player = player;
    this.camera = camera;
    this.canvas = canvas;

    this.initEventListeners();
  }

  public setCrosshair(crosshair: Crosshair): void {
    this.crosshair = crosshair;
  }

  private initEventListeners(): void {
    // 键盘事件
    document.addEventListener('keydown', (event) => this.onKeyDown(event));
    document.addEventListener('keyup', (event) => this.onKeyUp(event));

    // 鼠标事件
    this.canvas.addEventListener('click', () => this.requestPointerLock());
    document.addEventListener('pointerlockchange', () => this.onPointerLockChange());
    document.addEventListener('mousemove', (event) => this.onMouseMove(event));

    // 防止右键菜单
    this.canvas.addEventListener('contextmenu', (event) => event.preventDefault());
  }

  private onKeyDown(event: KeyboardEvent): void {
    this.keys[event.code.toLowerCase()] = true;
    
    // 防止默认行为
    if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.code)) {
      event.preventDefault();
    }
  }

  private onKeyUp(event: KeyboardEvent): void {
    this.keys[event.code.toLowerCase()] = false;
  }

  private onMouseMove(event: MouseEvent): void {
    if (!this.isMouseLocked) return;

    // 鼠标灵敏度
    const sensitivity = 0.002;
    
    this.mouse.x += event.movementX * sensitivity;
    this.mouse.y += event.movementY * sensitivity;

    // 限制鼠标移动范围
    this.mouse.x = Math.max(-Math.PI / 4, Math.min(Math.PI / 4, this.mouse.x));
    this.mouse.y = Math.max(-Math.PI / 6, Math.min(Math.PI / 6, this.mouse.y));
  }

  private requestPointerLock(): void {
    this.canvas.requestPointerLock();
  }

  private onPointerLockChange(): void {
    this.isMouseLocked = document.pointerLockElement === this.canvas;
  }

  public update(): void {
    this.handleMovement();
    this.handleShooting();
    this.handleCamera();
  }

  private handleMovement(): void {
    // WASD 移动
    if (this.keys['keyw'] || this.keys['arrowup']) {
      this.player.moveForward();
    }
    if (this.keys['keys'] || this.keys['arrowdown']) {
      this.player.moveBackward();
    }
    if (this.keys['keya'] || this.keys['arrowleft']) {
      this.player.moveLeft();
    }
    if (this.keys['keyd'] || this.keys['arrowright']) {
      this.player.moveRight();
    }

    // QE 上下移动
    if (this.keys['keyq']) {
      this.player.moveUp();
    }
    if (this.keys['keye']) {
      this.player.moveDown();
    }
  }

  private handleShooting(): void {
    // 空格键射击
    if (this.keys['space']) {
      let aimDirection: THREE.Vector3 | undefined;

      // 如果正在瞄准，使用瞄准方向
      if (this.crosshair && this.crosshair.isCurrentlyAiming()) {
        aimDirection = this.crosshair.getAimingDirection();
      }

      this.player.shoot(aimDirection);
    }

    // 技能快捷键
    if (this.keys['digit1']) {
      this.player.useSkill('rapidFire');
    }
    if (this.keys['digit2']) {
      this.player.useSkill('laserBeam');
    }
    if (this.keys['digit3']) {
      this.player.useSkill('missile');
    }
    if (this.keys['digit4']) {
      this.player.useSkill('shield');
    }
  }

  private handleCamera(): void {
    // 相机跟随玩家
    const playerPosition = this.player.position;
    const cameraOffset = new THREE.Vector3(0, 20, 50);
    
    // 添加鼠标控制的相机偏移
    if (this.isMouseLocked) {
      cameraOffset.x += this.mouse.x * 30;
      cameraOffset.y += this.mouse.y * 20;
    }

    // 平滑相机移动
    const targetPosition = playerPosition.clone().add(cameraOffset);
    this.camera.position.lerp(targetPosition, 0.1);

    // 相机始终看向玩家前方
    const lookAtTarget = playerPosition.clone().add(new THREE.Vector3(this.mouse.x * 10, this.mouse.y * 5, -20));
    this.camera.lookAt(lookAtTarget);
  }

  public getControlsInfo(): string[] {
    return [
      'WASD / 方向键 - 移动飞机',
      'Q/E - 上升/下降',
      '空格键 - 发射炮弹',
      '右键 - 瞄准模式',
      '滚轮 - 缩放瞄准镜',
      '1 - 快速射击技能',
      '2 - 激光束技能',
      '3 - 导弹技能',
      '4 - 护盾技能',
      '鼠标 - 控制视角',
      '点击画面锁定鼠标'
    ];
  }

  public isKeyPressed(key: string): boolean {
    return this.keys[key.toLowerCase()] || false;
  }

  public getMousePosition(): { x: number; y: number } {
    return { ...this.mouse };
  }

  public getMouseLockStatus(): boolean {
    return this.isMouseLocked;
  }

  // 释放鼠标锁定
  public exitPointerLock(): void {
    if (this.isMouseLocked) {
      document.exitPointerLock();
    }
  }

  // 重置控制状态
  public reset(): void {
    this.keys = {};
    this.mouse = { x: 0, y: 0 };
    this.exitPointerLock();
  }

  // 销毁控制器
  public dispose(): void {
    document.removeEventListener('keydown', this.onKeyDown);
    document.removeEventListener('keyup', this.onKeyUp);
    document.removeEventListener('pointerlockchange', this.onPointerLockChange);
    document.removeEventListener('mousemove', this.onMouseMove);
    this.canvas.removeEventListener('click', this.requestPointerLock);
    this.canvas.removeEventListener('contextmenu', (event) => event.preventDefault());
  }
}
