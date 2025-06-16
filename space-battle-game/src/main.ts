import './style.css';
import * as THREE from 'three';
import { GameWorld } from './game/GameWorld';
import { Player } from './game/Player';
import { Enemy } from './game/Enemy';
import { Controls } from './game/Controls';
import { Projectile } from './game/Projectile';
import { Crosshair } from './game/Crosshair';

class SpaceBattleGame {
  private gameWorld: GameWorld;
  private player: Player;
  private enemies: Enemy[] = [];
  private controls: Controls;
  private crosshair: Crosshair;
  private gameRunning: boolean = false;
  private score: number = 0;
  private enemySpawnTimer: number = 0;
  private enemySpawnInterval: number = 2000; // 2秒生成一个敌机
  private lastTime: number = 0;
  private gameStartTime: number = 0;

  // UI 元素
  private scoreElement: HTMLElement;
  private healthElement: HTMLElement;
  private energyElement: HTMLElement;
  private skillElements: { [key: string]: HTMLElement } = {};

  constructor() {
    this.initGame();
  }

  private initGame(): void {
    // 获取画布
    const canvas = document.querySelector<HTMLCanvasElement>('#game-canvas')!;

    // 初始化游戏世界
    this.gameWorld = new GameWorld(canvas);

    // 创建玩家
    this.player = new Player();
    this.gameWorld.addToScene(this.player.mesh);

    // 初始化控制系统
    this.controls = new Controls(this.player, this.gameWorld.camera, canvas);

    // 初始化瞄准镜系统
    this.crosshair = new Crosshair(this.gameWorld.camera, this.gameWorld.scene, canvas);

    // 连接瞄准镜到控制系统
    this.controls.setCrosshair(this.crosshair);

    // 获取UI元素
    this.scoreElement = document.querySelector('#score')!;
    this.healthElement = document.querySelector('#health')!;
    this.energyElement = document.querySelector('#energy')!;

    // 获取技能UI元素
    this.skillElements = {
      'rapidFire': document.querySelector('#skill-1')!,
      'laserBeam': document.querySelector('#skill-2')!,
      'missile': document.querySelector('#skill-3')!,
      'shield': document.querySelector('#skill-4')!
    };

    // 窗口大小调整事件
    window.addEventListener('resize', () => this.gameWorld.onWindowResize());

    // 开始游戏
    this.startGame();
  }

  private startGame(): void {
    this.gameRunning = true;
    this.gameStartTime = Date.now();
    this.lastTime = performance.now();
    this.gameLoop();

    console.log('太空战斗游戏已启动！');
    console.log('控制说明：');
    console.log('WASD - 移动飞机');
    console.log('Q/E - 上升/下降');
    console.log('空格键 - 发射炮弹');
    console.log('鼠标 - 控制视角（点击画面锁定鼠标）');
  }

  private gameLoop(): void {
    if (!this.gameRunning) return;

    const currentTime = performance.now();
    const deltaTime = (currentTime - this.lastTime) / 1000; // 转换为秒
    this.lastTime = currentTime;

    // 更新控制
    this.controls.update();

    // 更新玩家
    this.player.update(deltaTime);

    // 更新敌机
    this.updateEnemies(deltaTime);

    // 更新瞄准镜
    this.crosshair.update(this.enemies);

    // 生成新敌机
    this.spawnEnemies();

    // 检查碰撞
    this.checkCollisions();

    // 清理超出边界的对象
    this.cleanup();

    // 更新UI
    this.updateUI();

    // 渲染场景
    this.gameWorld.render();

    // 继续游戏循环
    requestAnimationFrame(() => this.gameLoop());
  }

  private updateEnemies(deltaTime: number): void {
    this.enemies.forEach((enemy, index) => {
      enemy.update(deltaTime, this.player.position);

      // 移除死亡或超出边界的敌机
      if (!enemy.isAlive() || enemy.isOutOfBounds()) {
        this.gameWorld.removeFromScene(enemy.mesh);

        // 如果敌机被击毁，增加分数
        if (!enemy.isAlive()) {
          this.score += enemy.getScore();
        }

        this.enemies.splice(index, 1);
      }
    });
  }

  private spawnEnemies(): void {
    const currentTime = Date.now();
    if (currentTime - this.enemySpawnTimer > this.enemySpawnInterval) {
      this.enemySpawnTimer = currentTime;

      // 随机生成敌机位置
      const x = (Math.random() - 0.5) * 150;
      const y = (Math.random() - 0.5) * 50;
      const z = -200;

      // 随机选择移动模式
      const patterns: ('straight' | 'zigzag' | 'circle')[] = ['straight', 'zigzag', 'circle'];
      const pattern = patterns[Math.floor(Math.random() * patterns.length)];

      const enemy = new Enemy(new THREE.Vector3(x, y, z), pattern);
      this.enemies.push(enemy);
      this.gameWorld.addToScene(enemy.mesh);

      // 随着时间推移，增加敌机生成频率
      const gameTime = (currentTime - this.gameStartTime) / 1000;
      this.enemySpawnInterval = Math.max(500, 2000 - gameTime * 10);
    }
  }

  private checkCollisions(): void {
    // 检查玩家炮弹与敌机的碰撞
    this.player.getProjectiles().forEach((projectile, pIndex) => {
      this.enemies.forEach((enemy, eIndex) => {
        if (projectile.checkCollision(enemy.mesh)) {
          // 敌机受伤
          enemy.takeDamage(projectile.damage);

          // 移除炮弹
          this.gameWorld.removeFromScene(projectile.mesh);
          this.player.removeProjectile(projectile);

          // 创建爆炸效果
          this.createExplosion(projectile.position);
        }
      });
    });

    // 检查敌机炮弹与玩家的碰撞
    this.enemies.forEach(enemy => {
      enemy.getProjectiles().forEach((projectile, pIndex) => {
        if (projectile.checkCollision(this.player.mesh)) {
          // 玩家受伤
          this.player.takeDamage(projectile.damage);

          // 移除炮弹
          this.gameWorld.removeFromScene(projectile.mesh);
          enemy.removeProjectile(projectile);

          // 创建爆炸效果
          this.createExplosion(projectile.position);
        }
      });
    });

    // 检查敌机与玩家的直接碰撞
    this.enemies.forEach((enemy, index) => {
      const distance = enemy.position.distanceTo(this.player.position);
      if (distance < 5) {
        // 碰撞伤害
        this.player.takeDamage(50);
        enemy.takeDamage(100);

        // 创建大爆炸效果
        this.createExplosion(enemy.position, true);
      }
    });

    // 检查游戏结束条件
    if (!this.player.isAlive()) {
      this.gameOver();
    }
  }

  private cleanup(): void {
    // 清理玩家炮弹
    this.player.getProjectiles().forEach((projectile, index) => {
      if (projectile.isOutOfBounds()) {
        this.gameWorld.removeFromScene(projectile.mesh);
        this.player.removeProjectile(projectile);
      } else {
        // 确保炮弹在场景中
        if (!this.gameWorld.scene.children.includes(projectile.mesh)) {
          this.gameWorld.addToScene(projectile.mesh);
        }
      }
    });

    // 清理敌机炮弹
    this.enemies.forEach(enemy => {
      enemy.getProjectiles().forEach((projectile, index) => {
        if (projectile.isOutOfBounds()) {
          this.gameWorld.removeFromScene(projectile.mesh);
          enemy.removeProjectile(projectile);
        } else {
          // 确保炮弹在场景中
          if (!this.gameWorld.scene.children.includes(projectile.mesh)) {
            this.gameWorld.addToScene(projectile.mesh);
          }
        }
      });
    });
  }

  private updateUI(): void {
    this.scoreElement.textContent = `得分: ${this.score}`;
    this.healthElement.textContent = `生命值: ${Math.round(this.player.health)}`;
    this.energyElement.textContent = `能量: ${Math.round(this.player.energy)}`;

    // 根据生命值改变颜色
    if (this.player.health > 60) {
      this.healthElement.style.color = '#00ff00';
    } else if (this.player.health > 30) {
      this.healthElement.style.color = '#ffff00';
    } else {
      this.healthElement.style.color = '#ff0000';
    }

    // 更新技能UI
    this.updateSkillsUI();
  }

  private updateSkillsUI(): void {
    const skillNames = ['rapidFire', 'laserBeam', 'missile', 'shield'];

    skillNames.forEach(skillName => {
      const element = this.skillElements[skillName];
      if (!element) return;

      const canUse = this.player.canUseSkill(skillName);
      const cooldown = this.player.getSkillCooldown(skillName);
      const skill = this.player.skills[skillName];

      // 更新技能状态样式
      element.className = 'skill-slot';
      if (canUse) {
        element.classList.add('available');
      } else if (cooldown > 0) {
        element.classList.add('cooldown');
      }

      // 更新冷却时间条
      const cooldownBar = element.querySelector('.skill-cooldown') as HTMLElement;
      if (cooldownBar && skill) {
        const cooldownPercent = cooldown / skill.cooldown;
        cooldownBar.style.transform = `scaleX(${cooldownPercent})`;
        cooldownBar.style.display = cooldown > 0 ? 'block' : 'none';
      }
    });
  }

  private createExplosion(position: THREE.Vector3, large: boolean = false): void {
    // 创建简单的爆炸效果
    const particleCount = large ? 20 : 10;
    const particles: THREE.Mesh[] = [];

    for (let i = 0; i < particleCount; i++) {
      const size = large ? 0.5 : 0.2;
      const particleGeometry = new THREE.SphereGeometry(size, 4, 4);
      const particleMaterial = new THREE.MeshBasicMaterial({
        color: large ? 0xff4400 : 0xffaa00,
        transparent: true,
        opacity: 0.8
      });

      const particle = new THREE.Mesh(particleGeometry, particleMaterial);
      particle.position.copy(position);

      // 随机方向和速度
      const direction = new THREE.Vector3(
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2
      ).normalize();

      const speed = Math.random() * (large ? 20 : 10) + 5;
      particle.userData = {
        velocity: direction.multiplyScalar(speed),
        life: 1.0,
        maxLife: large ? 2.0 : 1.0
      };

      particles.push(particle);
      this.gameWorld.addToScene(particle);
    }

    // 动画粒子
    const animateParticles = () => {
      particles.forEach((particle, index) => {
        if (particle.userData.life <= 0) {
          this.gameWorld.removeFromScene(particle);
          particles.splice(index, 1);
          return;
        }

        // 更新位置
        particle.position.add(particle.userData.velocity.clone().multiplyScalar(0.016));

        // 更新生命值和透明度
        particle.userData.life -= 0.016;
        const material = particle.material as THREE.MeshBasicMaterial;
        material.opacity = particle.userData.life / particle.userData.maxLife;

        // 减速
        particle.userData.velocity.multiplyScalar(0.98);
      });

      if (particles.length > 0) {
        requestAnimationFrame(animateParticles);
      }
    };

    animateParticles();
  }

  private gameOver(): void {
    this.gameRunning = false;

    // 显示游戏结束信息
    const gameOverDiv = document.createElement('div');
    gameOverDiv.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 30px;
      border-radius: 10px;
      text-align: center;
      font-size: 24px;
      z-index: 1000;
    `;

    gameOverDiv.innerHTML = `
      <h2 style="color: #ff4444; margin-bottom: 20px;">游戏结束</h2>
      <p>最终得分: ${this.score}</p>
      <button onclick="location.reload()" style="
        margin-top: 20px;
        padding: 10px 20px;
        font-size: 18px;
        background: #0088ff;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
      ">重新开始</button>
    `;

    document.body.appendChild(gameOverDiv);

    console.log(`游戏结束！最终得分: ${this.score}`);
  }
}

// 启动游戏
new SpaceBattleGame();
