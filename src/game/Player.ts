// 导入Three.js 3D图形库
import * as THREE from 'three';
// 导入炮弹系统
import { Projectile } from './Projectile';
// 导入音频管理系统
import { AudioManager } from '../audio/AudioManager';

/**
 * 技能接口定义
 * 定义每个技能的基本属性
 */
export interface Skill {
  name: string;        // 技能名称
  cooldown: number;    // 冷却时间(毫秒)
  lastUsed: number;    // 上次使用时间
  energy: number;      // 当前能量值
  maxEnergy: number;   // 最大能量值
}

/**
 * 玩家飞机类
 * 负责玩家飞机的所有功能和状态管理
 *
 * 主要功能:
 * - 飞机3D模型创建和动画
 * - 移动控制和物理系统
 * - 武器系统和射击逻辑
 * - 技能系统管理
 * - 生命值和能量管理
 * - 视觉特效和音效
 *
 * @author 9531lyj
 * @version 2.0
 */
export class Player {
  // 3D对象和位置
  public mesh!: THREE.Group;           // 玩家飞机3D模型组
  public position: THREE.Vector3;      // 当前位置坐标
  public velocity: THREE.Vector3;      // 速度向量

  // 生命值系统
  public health: number;               // 当前生命值
  public maxHealth: number;            // 最大生命值

  // 移动系统
  public speed: number;                // 移动速度

  // 武器系统
  public projectiles: Projectile[];    // 炮弹数组
  private lastShotTime: number;        // 上次射击时间
  private shotCooldown: number;        // 射击冷却时间(毫秒)
  private weaponType: 'normal' | 'rapid' | 'laser' | 'missile'; // 武器类型

  // 能量和技能系统
  public energy: number;               // 当前能量值
  public maxEnergy: number;            // 最大能量值
  public skills!: { [key: string]: Skill }; // 技能集合

  // 动画系统
  private animationTime: number;       // 动画时间计数器

  // 音频系统
  private audioManager: AudioManager | null = null; // 音频管理器

  /**
   * 构造函数 - 初始化玩家飞机
   * 设置所有初始属性和状态
   */
  constructor() {
    // 初始化位置和运动
    this.position = new THREE.Vector3(0, 0, 0);      // 起始位置：世界中心
    this.velocity = new THREE.Vector3(0, 0, 0);      // 初始速度：静止

    // 初始化生命值系统
    this.health = 100;                               // 满血状态
    this.maxHealth = 100;                            // 最大生命值

    // 初始化移动系统
    this.speed = 8;                                  // 基础移动速度(已优化)

    // 初始化能量系统
    this.energy = 100;                               // 满能量状态
    this.maxEnergy = 100;                            // 最大能量值

    // 初始化武器系统
    this.projectiles = [];                           // 空炮弹数组
    this.lastShotTime = 0;                           // 射击时间重置
    this.shotCooldown = 150;                         // 射击冷却150毫秒(已优化)
    this.weaponType = 'normal';                      // 默认武器类型

    // 初始化动画系统
    this.animationTime = 0;                          // 动画时间计数器

    // 初始化技能系统和3D模型
    this.initSkills();                               // 设置所有技能
    this.createMesh();                               // 创建3D飞机模型
  }

  private createMesh(): void {
    this.mesh = new THREE.Group();

    // 飞机主体 - 更精细的设计
    const bodyGeometry = new THREE.CylinderGeometry(0.8, 1.5, 10, 12);
    const bodyMaterial = new THREE.MeshPhongMaterial({
      color: 0x2196F3,
      shininess: 100,
      specular: 0x4FC3F7
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.rotation.x = Math.PI / 2;
    body.castShadow = true;
    body.receiveShadow = true;
    this.mesh.add(body);

    // 驾驶舱
    const cockpitGeometry = new THREE.SphereGeometry(1.2, 12, 8);
    const cockpitMaterial = new THREE.MeshPhongMaterial({
      color: 0x1976D2,
      transparent: true,
      opacity: 0.8,
      shininess: 150
    });
    const cockpit = new THREE.Mesh(cockpitGeometry, cockpitMaterial);
    cockpit.position.set(0, 0.5, 2);
    cockpit.scale.set(1, 0.6, 1.2);
    cockpit.castShadow = true;
    this.mesh.add(cockpit);

    // 主翅膀 - 更复杂的形状
    const wingGeometry = new THREE.BoxGeometry(12, 0.3, 3);
    const wingMaterial = new THREE.MeshPhongMaterial({
      color: 0x1565C0,
      shininess: 80
    });
    const mainWings = new THREE.Mesh(wingGeometry, wingMaterial);
    mainWings.position.set(0, 0, -1);
    mainWings.castShadow = true;
    this.mesh.add(mainWings);

    // 副翅膀
    const subWingGeometry = new THREE.BoxGeometry(6, 0.2, 1.5);
    const subWings = new THREE.Mesh(subWingGeometry, wingMaterial);
    subWings.position.set(0, 0, -3);
    subWings.castShadow = true;
    this.mesh.add(subWings);

    // 武器挂载点
    const weaponMountGeometry = new THREE.BoxGeometry(1, 0.3, 0.8);
    const weaponMountMaterial = new THREE.MeshPhongMaterial({ color: 0x424242 });

    const leftWeaponMount = new THREE.Mesh(weaponMountGeometry, weaponMountMaterial);
    leftWeaponMount.position.set(-4, -0.2, 0);
    this.mesh.add(leftWeaponMount);

    const rightWeaponMount = new THREE.Mesh(weaponMountGeometry, weaponMountMaterial);
    rightWeaponMount.position.set(4, -0.2, 0);
    this.mesh.add(rightWeaponMount);

    // 引擎 - 更精细的设计
    const engineGeometry = new THREE.CylinderGeometry(0.6, 0.8, 2, 8);
    const engineMaterial = new THREE.MeshPhongMaterial({
      color: 0x37474F,
      shininess: 120
    });

    const leftEngine = new THREE.Mesh(engineGeometry, engineMaterial);
    leftEngine.position.set(-2.5, 0, -4.5);
    leftEngine.rotation.x = Math.PI / 2;
    leftEngine.castShadow = true;
    this.mesh.add(leftEngine);

    const rightEngine = new THREE.Mesh(engineGeometry, engineMaterial);
    rightEngine.position.set(2.5, 0, -4.5);
    rightEngine.rotation.x = Math.PI / 2;
    rightEngine.castShadow = true;
    this.mesh.add(rightEngine);

    // 引擎火焰效果
    this.createEngineFlames();

    // 添加装饰灯光
    this.createLights();

    this.mesh.position.copy(this.position);
  }

  private createEngineFlames(): void {
    // 左引擎火焰
    const flameGeometry = new THREE.ConeGeometry(0.4, 3, 8);
    const flameMaterial = new THREE.MeshBasicMaterial({
      color: 0xff4400,
      transparent: true,
      opacity: 0.8
    });

    const leftFlame = new THREE.Mesh(flameGeometry, flameMaterial);
    leftFlame.position.set(-2.5, 0, -7);
    leftFlame.rotation.x = Math.PI / 2;
    leftFlame.name = 'leftFlame';
    this.mesh.add(leftFlame);

    const rightFlame = new THREE.Mesh(flameGeometry, flameMaterial);
    rightFlame.position.set(2.5, 0, -7);
    rightFlame.rotation.x = Math.PI / 2;
    rightFlame.name = 'rightFlame';
    this.mesh.add(rightFlame);

    // 内层火焰（更亮）
    const innerFlameGeometry = new THREE.ConeGeometry(0.2, 2, 6);
    const innerFlameMaterial = new THREE.MeshBasicMaterial({
      color: 0x00aaff,
      transparent: true,
      opacity: 0.9
    });

    const leftInnerFlame = new THREE.Mesh(innerFlameGeometry, innerFlameMaterial);
    leftInnerFlame.position.set(-2.5, 0, -6.5);
    leftInnerFlame.rotation.x = Math.PI / 2;
    leftInnerFlame.name = 'leftInnerFlame';
    this.mesh.add(leftInnerFlame);

    const rightInnerFlame = new THREE.Mesh(innerFlameGeometry, innerFlameMaterial);
    rightInnerFlame.position.set(2.5, 0, -6.5);
    rightInnerFlame.rotation.x = Math.PI / 2;
    rightInnerFlame.name = 'rightInnerFlame';
    this.mesh.add(rightInnerFlame);
  }

  private createLights(): void {
    // 导航灯
    const navLightGeometry = new THREE.SphereGeometry(0.1, 6, 6);

    // 红色导航灯（左翼）
    const redLightMaterial = new THREE.MeshBasicMaterial({
      color: 0xff0000
    });
    const redLight = new THREE.Mesh(navLightGeometry, redLightMaterial);
    redLight.position.set(-6, 0, -1);
    this.mesh.add(redLight);

    // 绿色导航灯（右翼）
    const greenLightMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ff00
    });
    const greenLight = new THREE.Mesh(navLightGeometry, greenLightMaterial);
    greenLight.position.set(6, 0, -1);
    this.mesh.add(greenLight);

    // 白色频闪灯
    const strobeGeometry = new THREE.SphereGeometry(0.15, 8, 8);
    const strobeMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff
    });
    const strobeLight = new THREE.Mesh(strobeGeometry, strobeMaterial);
    strobeLight.position.set(0, 1, 2);
    strobeLight.name = 'strobeLight';
    this.mesh.add(strobeLight);
  }

  private initSkills(): void {
    this.skills = {
      rapidFire: {
        name: '快速射击',
        cooldown: 5000,
        lastUsed: 0,
        energy: 30,
        maxEnergy: 30
      },
      laserBeam: {
        name: '激光束',
        cooldown: 8000,
        lastUsed: 0,
        energy: 50,
        maxEnergy: 50
      },
      missile: {
        name: '导弹',
        cooldown: 10000,
        lastUsed: 0,
        energy: 40,
        maxEnergy: 40
      },
      shield: {
        name: '护盾',
        cooldown: 15000,
        lastUsed: 0,
        energy: 60,
        maxEnergy: 60
      }
    };
  }

  public update(deltaTime: number): void {
    this.animationTime += deltaTime;

    // 更新位置 - 更平滑的移动
    this.position.add(this.velocity.clone().multiplyScalar(deltaTime));
    this.mesh.position.copy(this.position);

    // 限制移动范围
    this.position.x = Math.max(-120, Math.min(120, this.position.x));
    this.position.y = Math.max(-60, Math.min(60, this.position.y));
    this.position.z = Math.max(-150, Math.min(150, this.position.z));

    // 飞机倾斜效果（根据移动方向）
    this.mesh.rotation.z = -this.velocity.x * 0.1;
    this.mesh.rotation.x = this.velocity.y * 0.05;

    // 更新引擎火焰动画
    this.updateEngineFlames();

    // 更新频闪灯
    this.updateStrobeLight();

    // 更新炮弹
    this.projectiles.forEach((projectile, index) => {
      projectile.update(deltaTime);

      // 移除超出范围的炮弹
      if (projectile.position.z < -1000) {
        this.projectiles.splice(index, 1);
      }
    });

    // 能量恢复
    this.energy = Math.min(this.maxEnergy, this.energy + deltaTime * 10);

    // 减少速度（摩擦力效果）- 更自然的减速
    this.velocity.multiplyScalar(0.92);
  }

  private updateEngineFlames(): void {
    const leftFlame = this.mesh.getObjectByName('leftFlame');
    const rightFlame = this.mesh.getObjectByName('rightFlame');
    const leftInnerFlame = this.mesh.getObjectByName('leftInnerFlame');
    const rightInnerFlame = this.mesh.getObjectByName('rightInnerFlame');

    if (leftFlame && rightFlame && leftInnerFlame && rightInnerFlame) {
      // 根据速度调整火焰大小
      const speed = this.velocity.length();
      const flameScale = 1 + speed * 0.1;

      leftFlame.scale.y = flameScale + Math.sin(this.animationTime * 10) * 0.2;
      rightFlame.scale.y = flameScale + Math.sin(this.animationTime * 10 + 1) * 0.2;
      leftInnerFlame.scale.y = flameScale + Math.sin(this.animationTime * 15) * 0.3;
      rightInnerFlame.scale.y = flameScale + Math.sin(this.animationTime * 15 + 0.5) * 0.3;
    }
  }

  private updateStrobeLight(): void {
    const strobeLight = this.mesh.getObjectByName('strobeLight');
    if (strobeLight) {
      const material = (strobeLight as THREE.Mesh).material as THREE.MeshBasicMaterial;
      const intensity = 0.5 + Math.sin(this.animationTime * 8) * 0.3;
      material.opacity = intensity;
    }
  }

  public moveLeft(): void {
    this.velocity.x = Math.max(this.velocity.x - this.speed * 0.3, -this.speed * 1.5);
  }

  public moveRight(): void {
    this.velocity.x = Math.min(this.velocity.x + this.speed * 0.3, this.speed * 1.5);
  }

  public moveUp(): void {
    this.velocity.y = Math.min(this.velocity.y + this.speed * 0.3, this.speed * 1.2);
  }

  public moveDown(): void {
    this.velocity.y = Math.max(this.velocity.y - this.speed * 0.3, -this.speed * 1.2);
  }

  public moveForward(): void {
    this.velocity.z = Math.max(this.velocity.z - this.speed * 0.3, -this.speed * 1.5);
  }

  public moveBackward(): void {
    this.velocity.z = Math.min(this.velocity.z + this.speed * 0.3, this.speed * 1.2);
  }

  public shoot(aimDirection?: THREE.Vector3): boolean {
    const currentTime = Date.now();
    if (currentTime - this.lastShotTime < this.shotCooldown) {
      return false;
    }

    this.lastShotTime = currentTime;

    // 播放射击音效
    if (this.audioManager) {
      this.audioManager.playSoundEffect('shoot');
    }

    // 确定射击方向
    let shootDirection = new THREE.Vector3(0, 0, -50);
    if (aimDirection) {
      shootDirection = aimDirection.clone().multiplyScalar(50);
    }

    // 根据武器类型创建不同的炮弹
    if (this.weaponType === 'rapid') {
      // 快速射击模式 - 更多炮弹
      for (let i = 0; i < 4; i++) {
        const offset = (i - 1.5) * 1.5;
        const projectile = new Projectile(
          new THREE.Vector3(this.position.x + offset, this.position.y, this.position.z),
          shootDirection.clone(),
          true
        );
        this.projectiles.push(projectile);
      }
    } else {
      // 普通射击模式 - 双炮弹
      const leftProjectile = new Projectile(
        new THREE.Vector3(this.position.x - 2, this.position.y, this.position.z),
        shootDirection.clone(),
        true
      );

      const rightProjectile = new Projectile(
        new THREE.Vector3(this.position.x + 2, this.position.y, this.position.z),
        shootDirection.clone(),
        true
      );

      this.projectiles.push(leftProjectile, rightProjectile);
    }

    return true;
  }

  public takeDamage(damage: number): void {
    this.health = Math.max(0, this.health - damage);
  }

  public heal(amount: number): void {
    this.health = Math.min(this.maxHealth, this.health + amount);
  }

  public isAlive(): boolean {
    return this.health > 0;
  }

  public getProjectiles(): Projectile[] {
    return this.projectiles;
  }

  public removeProjectile(projectile: Projectile): void {
    const index = this.projectiles.indexOf(projectile);
    if (index > -1) {
      this.projectiles.splice(index, 1);
    }
  }

  // 技能系统
  public useSkill(skillName: string): boolean {
    const skill = this.skills[skillName];
    if (!skill) return false;

    const currentTime = Date.now();
    if (currentTime - skill.lastUsed < skill.cooldown || this.energy < skill.energy) {
      return false;
    }

    skill.lastUsed = currentTime;
    this.energy -= skill.energy;

    switch (skillName) {
      case 'rapidFire':
        return this.activateRapidFire();
      case 'laserBeam':
        return this.activateLaserBeam();
      case 'missile':
        return this.activateMissile();
      case 'shield':
        return this.activateShield();
      default:
        return false;
    }
  }

  private activateRapidFire(): boolean {
    this.weaponType = 'rapid';
    setTimeout(() => {
      this.weaponType = 'normal';
    }, 3000);
    return true;
  }

  private activateLaserBeam(): boolean {
    // 创建激光束
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        const laser = new Projectile(
          new THREE.Vector3(this.position.x, this.position.y, this.position.z),
          new THREE.Vector3(0, 0, -80),
          true
        );
        laser.damage = 50;
        this.projectiles.push(laser);
      }, i * 100);
    }
    return true;
  }

  private activateMissile(): boolean {
    // 创建追踪导弹
    const missile = new Projectile(
      new THREE.Vector3(this.position.x, this.position.y, this.position.z),
      new THREE.Vector3(0, 0, -60),
      true
    );
    missile.damage = 100;
    this.projectiles.push(missile);
    return true;
  }

  private activateShield(): boolean {
    // 临时增加生命值上限和恢复生命值
    this.health = Math.min(this.maxHealth, this.health + 50);
    return true;
  }

  public getSkillCooldown(skillName: string): number {
    const skill = this.skills[skillName];
    if (!skill) return 0;

    const currentTime = Date.now();
    const timeSinceLastUse = currentTime - skill.lastUsed;
    return Math.max(0, skill.cooldown - timeSinceLastUse);
  }

  public canUseSkill(skillName: string): boolean {
    const skill = this.skills[skillName];
    if (!skill) return false;

    return this.getSkillCooldown(skillName) === 0 && this.energy >= skill.energy;
  }

  /**
   * 设置音频管理器
   */
  public setAudioManager(audioManager: AudioManager): void {
    this.audioManager = audioManager;
  }

  /**
   * 重置玩家状态
   * 用于游戏重新开始时恢复初始状态
   */
  public reset(): void {
    // 重置位置和运动
    this.position.set(0, 0, 0);
    this.velocity.set(0, 0, 0);
    this.mesh.position.copy(this.position);

    // 重置生命值和能量
    this.health = this.maxHealth;
    this.energy = this.maxEnergy;

    // 重置武器系统
    this.projectiles = [];
    this.lastShotTime = 0;
    this.weaponType = 'normal';

    // 重置动画时间
    this.animationTime = 0;

    // 重置飞机姿态
    this.mesh.rotation.set(0, 0, 0);

    // 重置技能冷却时间
    Object.keys(this.skills).forEach(skillName => {
      this.skills[skillName].lastUsed = 0;
    });

    console.log('✅ 玩家状态已重置');
  }
}
