import * as THREE from 'three';
import { Projectile } from './Projectile';

export class Enemy {
  public mesh: THREE.Group;
  public position: THREE.Vector3;
  public velocity: THREE.Vector3;
  public health: number;
  public maxHealth: number;
  public speed: number;
  public projectiles: Projectile[];
  public boundingBox: THREE.Box3;
  private lastShotTime: number;
  private shotCooldown: number;
  private movementPattern: 'straight' | 'zigzag' | 'circle';
  private movementTime: number;
  private targetPosition: THREE.Vector3;

  constructor(position: THREE.Vector3, movementPattern: 'straight' | 'zigzag' | 'circle' = 'straight') {
    this.position = position.clone();
    this.velocity = new THREE.Vector3(0, 0, 2); // 向玩家方向移动
    this.health = 50;
    this.maxHealth = 50;
    this.speed = 3;
    this.projectiles = [];
    this.boundingBox = new THREE.Box3();
    this.lastShotTime = 0;
    this.shotCooldown = 1000; // 1秒冷却时间
    this.movementPattern = movementPattern;
    this.movementTime = 0;
    this.targetPosition = new THREE.Vector3();
    
    this.createMesh();
  }

  private createMesh(): void {
    this.mesh = new THREE.Group();

    // 敌机主体 - 更威胁性的设计
    const bodyGeometry = new THREE.CylinderGeometry(1.2, 0.8, 8, 8);
    const bodyMaterial = new THREE.MeshPhongMaterial({
      color: 0xE53935,
      shininess: 80,
      specular: 0xFF5722
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.rotation.x = -Math.PI / 2;
    body.castShadow = true;
    body.receiveShadow = true;
    this.mesh.add(body);

    // 敌机装甲板
    const armorGeometry = new THREE.BoxGeometry(2.5, 1, 6);
    const armorMaterial = new THREE.MeshPhongMaterial({
      color: 0xC62828,
      shininess: 60
    });
    const armor = new THREE.Mesh(armorGeometry, armorMaterial);
    armor.position.set(0, 0.3, 0);
    armor.castShadow = true;
    this.mesh.add(armor);

    // 敌机翅膀 - 更锋利的设计
    const wingGeometry = new THREE.BoxGeometry(8, 0.4, 2.5);
    const wingMaterial = new THREE.MeshPhongMaterial({
      color: 0xB71C1C,
      shininess: 70
    });
    const wings = new THREE.Mesh(wingGeometry, wingMaterial);
    wings.position.set(0, 0, 1);
    wings.castShadow = true;
    this.mesh.add(wings);

    // 武器挂载点
    const weaponGeometry = new THREE.BoxGeometry(0.8, 0.8, 1.5);
    const weaponMaterial = new THREE.MeshPhongMaterial({ color: 0x424242 });

    const leftWeapon = new THREE.Mesh(weaponGeometry, weaponMaterial);
    leftWeapon.position.set(-3, -0.2, -1);
    this.mesh.add(leftWeapon);

    const rightWeapon = new THREE.Mesh(weaponGeometry, weaponMaterial);
    rightWeapon.position.set(3, -0.2, -1);
    this.mesh.add(rightWeapon);

    // 敌机引擎 - 更大更威胁
    const engineGeometry = new THREE.CylinderGeometry(0.5, 0.7, 1.5, 6);
    const engineMaterial = new THREE.MeshPhongMaterial({
      color: 0x1A237E,
      shininess: 100
    });

    const leftEngine = new THREE.Mesh(engineGeometry, engineMaterial);
    leftEngine.position.set(-2, 0, 3.5);
    leftEngine.rotation.x = Math.PI / 2;
    leftEngine.castShadow = true;
    this.mesh.add(leftEngine);

    const rightEngine = new THREE.Mesh(engineGeometry, engineMaterial);
    rightEngine.position.set(2, 0, 3.5);
    rightEngine.rotation.x = Math.PI / 2;
    rightEngine.castShadow = true;
    this.mesh.add(rightEngine);

    // 引擎火焰
    this.createEnemyFlames();

    // 威胁指示灯
    const lightGeometry = new THREE.SphereGeometry(0.3, 8, 8);
    const lightMaterial = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      emissive: 0xff0000,
      emissiveIntensity: 0.8
    });
    const light = new THREE.Mesh(lightGeometry, lightMaterial);
    light.position.set(0, 0.8, -2);
    light.name = 'threatLight';
    this.mesh.add(light);

    // 创建生命值条
    this.createHealthBar();

    this.mesh.position.copy(this.position);
  }

  private createEnemyFlames(): void {
    // 敌机引擎火焰（红色）
    const flameGeometry = new THREE.ConeGeometry(0.3, 2, 6);
    const flameMaterial = new THREE.MeshBasicMaterial({
      color: 0xff2200,
      transparent: true,
      opacity: 0.7
    });

    const leftFlame = new THREE.Mesh(flameGeometry, flameMaterial);
    leftFlame.position.set(-2, 0, 5.5);
    leftFlame.rotation.x = Math.PI / 2;
    leftFlame.name = 'leftFlame';
    this.mesh.add(leftFlame);

    const rightFlame = new THREE.Mesh(flameGeometry, flameMaterial);
    rightFlame.position.set(2, 0, 5.5);
    rightFlame.rotation.x = Math.PI / 2;
    rightFlame.name = 'rightFlame';
    this.mesh.add(rightFlame);
  }

  private createHealthBar(): void {
    // 生命值条背景
    const healthBarBg = new THREE.PlaneGeometry(3, 0.3);
    const healthBarBgMaterial = new THREE.MeshBasicMaterial({
      color: 0x333333,
      transparent: true,
      opacity: 0.8
    });
    const healthBarBgMesh = new THREE.Mesh(healthBarBg, healthBarBgMaterial);
    healthBarBgMesh.position.set(0, 2, 0);
    healthBarBgMesh.name = 'healthBarBg';
    this.mesh.add(healthBarBgMesh);

    // 生命值条
    const healthBar = new THREE.PlaneGeometry(3, 0.25);
    const healthBarMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      transparent: true,
      opacity: 0.9
    });
    const healthBarMesh = new THREE.Mesh(healthBar, healthBarMaterial);
    healthBarMesh.position.set(0, 2, 0.01);
    healthBarMesh.name = 'healthBar';
    this.mesh.add(healthBarMesh);
  }

  public update(deltaTime: number, playerPosition: THREE.Vector3): void {
    this.movementTime += deltaTime;

    // 根据移动模式更新位置
    this.updateMovement(deltaTime, playerPosition);

    // 更新位置
    this.position.add(this.velocity.clone().multiplyScalar(deltaTime));
    this.mesh.position.copy(this.position);

    // 更新包围盒
    this.boundingBox.setFromObject(this.mesh);

    // 更新炮弹
    this.projectiles.forEach((projectile, index) => {
      projectile.update(deltaTime);

      // 移除超出范围的炮弹
      if (projectile.position.z > 200) {
        this.projectiles.splice(index, 1);
      }
    });

    // AI射击逻辑
    this.updateShooting(playerPosition);

    // 更新动画效果
    this.updateAnimations(deltaTime);

    // 更新生命值条
    this.updateHealthBar();
  }

  private updateAnimations(deltaTime: number): void {
    // 飞机轻微摇摆
    this.mesh.rotation.z = Math.sin(this.movementTime * 2) * 0.08;
    this.mesh.rotation.x = Math.sin(this.movementTime * 1.5) * 0.05;

    // 更新引擎火焰
    const leftFlame = this.mesh.getObjectByName('leftFlame');
    const rightFlame = this.mesh.getObjectByName('rightFlame');

    if (leftFlame && rightFlame) {
      leftFlame.scale.y = 1 + Math.sin(this.movementTime * 8) * 0.3;
      rightFlame.scale.y = 1 + Math.sin(this.movementTime * 8 + 1) * 0.3;
    }

    // 威胁指示灯闪烁
    const threatLight = this.mesh.getObjectByName('threatLight');
    if (threatLight) {
      const material = (threatLight as THREE.Mesh).material as THREE.MeshBasicMaterial;
      material.emissiveIntensity = 0.5 + Math.sin(this.movementTime * 6) * 0.3;
    }
  }

  private updateHealthBar(): void {
    const healthBar = this.mesh.getObjectByName('healthBar') as THREE.Mesh;
    if (healthBar) {
      // 更新生命值条宽度
      const healthPercent = this.health / this.maxHealth;
      healthBar.scale.x = healthPercent;

      // 更新生命值条颜色
      const material = healthBar.material as THREE.MeshBasicMaterial;
      if (healthPercent > 0.6) {
        material.color.setHex(0x00ff00); // 绿色
      } else if (healthPercent > 0.3) {
        material.color.setHex(0xffff00); // 黄色
      } else {
        material.color.setHex(0xff0000); // 红色
      }

      // 生命值条始终面向相机
      const healthBarBg = this.mesh.getObjectByName('healthBarBg');
      if (healthBarBg) {
        healthBar.lookAt(0, 0, 0);
        healthBarBg.lookAt(0, 0, 0);
      }
    }
  }

  private updateMovement(deltaTime: number, playerPosition: THREE.Vector3): void {
    switch (this.movementPattern) {
      case 'straight':
        // 直线向前移动
        this.velocity.z = this.speed;
        break;

      case 'zigzag':
        // 之字形移动
        this.velocity.z = this.speed;
        this.velocity.x = Math.sin(this.movementTime * 3) * this.speed * 0.5;
        break;

      case 'circle':
        // 圆形移动
        const radius = 20;
        const centerX = this.targetPosition.x || this.position.x;
        const centerZ = this.targetPosition.z || this.position.z;
        
        this.velocity.x = Math.cos(this.movementTime) * this.speed * 0.3;
        this.velocity.z = Math.sin(this.movementTime) * this.speed * 0.3 + this.speed * 0.5;
        break;
    }

    // 限制移动范围
    if (Math.abs(this.position.x) > 80) {
      this.velocity.x *= -0.5;
    }
  }

  private updateShooting(playerPosition: THREE.Vector3): void {
    const currentTime = Date.now();
    if (currentTime - this.lastShotTime < this.shotCooldown) {
      return;
    }

    // 计算到玩家的距离
    const distanceToPlayer = this.position.distanceTo(playerPosition);
    
    // 只有在一定范围内才射击
    if (distanceToPlayer < 150 && distanceToPlayer > 20) {
      // 计算射击方向（朝向玩家）
      const direction = playerPosition.clone().sub(this.position).normalize();
      
      // 添加一些随机性，让AI不那么精准
      direction.x += (Math.random() - 0.5) * 0.3;
      direction.y += (Math.random() - 0.5) * 0.3;
      direction.normalize();

      this.shoot(direction);
    }
  }

  public shoot(direction?: THREE.Vector3): boolean {
    const currentTime = Date.now();
    if (currentTime - this.lastShotTime < this.shotCooldown) {
      return false;
    }

    this.lastShotTime = currentTime;

    // 默认向前射击
    const shootDirection = direction || new THREE.Vector3(0, 0, 1);
    shootDirection.multiplyScalar(30); // 炮弹速度

    const projectile = new Projectile(
      new THREE.Vector3(this.position.x, this.position.y, this.position.z - 2),
      shootDirection,
      false // 不是玩家的炮弹
    );

    this.projectiles.push(projectile);
    return true;
  }

  public takeDamage(damage: number): void {
    this.health = Math.max(0, this.health - damage);
    
    // 受伤效果
    if (this.health > 0) {
      this.mesh.children.forEach(child => {
        if (child instanceof THREE.Mesh) {
          const material = child.material as THREE.MeshLambertMaterial;
          const originalColor = material.color.clone();
          material.color.setHex(0xffffff);
          
          setTimeout(() => {
            material.color.copy(originalColor);
          }, 100);
        }
      });
    }
  }

  public isAlive(): boolean {
    return this.health > 0;
  }

  public isOutOfBounds(): boolean {
    return this.position.z > 200 || 
           Math.abs(this.position.x) > 200 || 
           Math.abs(this.position.y) > 100;
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

  public getBoundingBox(): THREE.Box3 {
    return this.boundingBox;
  }

  public getScore(): number {
    // 根据敌机类型返回不同分数
    switch (this.movementPattern) {
      case 'straight': return 100;
      case 'zigzag': return 150;
      case 'circle': return 200;
      default: return 100;
    }
  }
}
