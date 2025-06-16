import * as THREE from 'three';

export class Projectile {
  public mesh: THREE.Mesh;
  public position: THREE.Vector3;
  public velocity: THREE.Vector3;
  public damage: number;
  public isPlayerProjectile: boolean;
  public boundingBox: THREE.Box3;

  constructor(position: THREE.Vector3, velocity: THREE.Vector3, isPlayerProjectile: boolean = true) {
    this.position = position.clone();
    this.velocity = velocity.clone();
    this.damage = isPlayerProjectile ? 25 : 10;
    this.isPlayerProjectile = isPlayerProjectile;
    this.boundingBox = new THREE.Box3();
    
    this.createMesh();
  }

  private createMesh(): void {
    // 炮弹几何体
    const geometry = new THREE.SphereGeometry(0.3, 8, 8);
    
    // 根据是否为玩家炮弹选择不同颜色
    const color = this.isPlayerProjectile ? 0x00ff00 : 0xff0000;
    const material = new THREE.MeshBasicMaterial({ 
      color: color,
      emissive: color,
      emissiveIntensity: 0.5
    });

    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.copy(this.position);

    // 添加光晕效果
    const glowGeometry = new THREE.SphereGeometry(0.6, 8, 8);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.3
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    this.mesh.add(glow);

    // 添加拖尾效果
    this.createTrail();
  }

  private createTrail(): void {
    const trailGeometry = new THREE.CylinderGeometry(0.1, 0.3, 2, 8);
    const trailColor = this.isPlayerProjectile ? 0x00ff00 : 0xff0000;
    const trailMaterial = new THREE.MeshBasicMaterial({
      color: trailColor,
      transparent: true,
      opacity: 0.6
    });

    const trail = new THREE.Mesh(trailGeometry, trailMaterial);
    trail.rotation.x = Math.PI / 2;
    trail.position.z = 1; // 在炮弹后面
    this.mesh.add(trail);
  }

  public update(deltaTime: number): void {
    // 更新位置
    this.position.add(this.velocity.clone().multiplyScalar(deltaTime));
    this.mesh.position.copy(this.position);

    // 更新包围盒
    this.boundingBox.setFromObject(this.mesh);

    // 添加旋转效果
    this.mesh.rotation.x += 0.1;
    this.mesh.rotation.y += 0.1;
  }

  public isOutOfBounds(): boolean {
    // 检查炮弹是否超出游戏边界
    return Math.abs(this.position.x) > 200 || 
           Math.abs(this.position.y) > 200 || 
           Math.abs(this.position.z) > 1000;
  }

  public checkCollision(target: THREE.Object3D): boolean {
    // 创建目标的包围盒
    const targetBox = new THREE.Box3().setFromObject(target);
    
    // 检查包围盒是否相交
    return this.boundingBox.intersectsBox(targetBox);
  }

  public destroy(): void {
    // 创建爆炸效果
    this.createExplosion();
  }

  private createExplosion(): void {
    // 简单的爆炸粒子效果
    const particleCount = 10;
    const particles: THREE.Mesh[] = [];

    for (let i = 0; i < particleCount; i++) {
      const particleGeometry = new THREE.SphereGeometry(0.1, 4, 4);
      const particleMaterial = new THREE.MeshBasicMaterial({
        color: this.isPlayerProjectile ? 0x00ff00 : 0xff0000,
        transparent: true,
        opacity: 0.8
      });

      const particle = new THREE.Mesh(particleGeometry, particleMaterial);
      particle.position.copy(this.position);
      
      // 随机方向
      const direction = new THREE.Vector3(
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2
      ).normalize();
      
      particle.userData = {
        velocity: direction.multiplyScalar(Math.random() * 10 + 5),
        life: 1.0
      };

      particles.push(particle);
    }

    // 这里应该将粒子添加到场景中，但需要场景引用
    // 在实际游戏中，这个方法会接收场景参数
  }

  public getBoundingBox(): THREE.Box3 {
    return this.boundingBox;
  }
}
