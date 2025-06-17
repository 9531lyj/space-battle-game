/**
 * 音频管理器 - 处理游戏中的所有音频播放
 * 包括背景音乐、音效等
 * 作者: 9531lyj
 * 邮箱: 2233613389@qq.com
 */

import { SpaceMusicGenerator } from './SpaceMusicGenerator';

export class AudioManager {
  private spaceMusicGenerator: SpaceMusicGenerator;
  private soundEffects: Map<string, AudioBuffer> = new Map();
  private audioContext: AudioContext | null = null;
  private isMuted: boolean = false;
  private bgmVolume: number = 0.3; // 背景音乐音量
  private sfxVolume: number = 0.5; // 音效音量
  private isInitialized: boolean = false;

  constructor() {
    this.spaceMusicGenerator = new SpaceMusicGenerator();
    this.initializeAudio();
  }

  /**
   * 初始化音频系统
   */
  private async initializeAudio(): Promise<void> {
    try {
      // 初始化音频上下文
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

      // 预加载音效
      await this.loadSoundEffects();

      this.isInitialized = true;
      console.log('🎵 音频系统初始化完成');
    } catch (error) {
      console.warn('音频初始化失败:', error);
      this.isInitialized = false;
    }
  }

  /**
   * 加载音效文件 - 使用Web Audio API生成音效
   */
  private async loadSoundEffects(): Promise<void> {
    if (!this.audioContext) return;

    try {
      // 生成射击音效
      const shootBuffer = this.createShootSound();
      this.soundEffects.set('shoot', shootBuffer);

      // 生成爆炸音效
      const explosionBuffer = this.createExplosionSound();
      this.soundEffects.set('explosion', explosionBuffer);

      // 生成击中音效
      const hitBuffer = this.createHitSound();
      this.soundEffects.set('hit', hitBuffer);

      console.log('🎵 音效加载完成');
    } catch (error) {
      console.warn('音效生成失败:', error);
    }
  }

  /**
   * 创建射击音效
   */
  private createShootSound(): AudioBuffer {
    if (!this.audioContext) throw new Error('音频上下文未初始化');

    const duration = 0.2;
    const sampleRate = this.audioContext.sampleRate;
    const buffer = this.audioContext.createBuffer(1, duration * sampleRate, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate;
      // 创建激光射击声音
      const frequency = 800 * Math.exp(-t * 10);
      const noise = (Math.random() - 0.5) * 0.3;
      const envelope = Math.exp(-t * 8);
      data[i] = (Math.sin(2 * Math.PI * frequency * t) + noise) * envelope * 0.3;
    }

    return buffer;
  }

  /**
   * 创建爆炸音效
   */
  private createExplosionSound(): AudioBuffer {
    if (!this.audioContext) throw new Error('音频上下文未初始化');

    const duration = 1.0;
    const sampleRate = this.audioContext.sampleRate;
    const buffer = this.audioContext.createBuffer(1, duration * sampleRate, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate;
      // 创建爆炸声音
      const noise = (Math.random() - 0.5) * 2;
      const lowFreq = Math.sin(2 * Math.PI * 60 * t) * Math.exp(-t * 3);
      const envelope = Math.exp(-t * 2);
      data[i] = (noise * 0.7 + lowFreq * 0.3) * envelope * 0.5;
    }

    return buffer;
  }

  /**
   * 创建击中音效
   */
  private createHitSound(): AudioBuffer {
    if (!this.audioContext) throw new Error('音频上下文未初始化');

    const duration = 0.3;
    const sampleRate = this.audioContext.sampleRate;
    const buffer = this.audioContext.createBuffer(1, duration * sampleRate, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate;
      // 创建金属撞击声音
      const frequency = 1200 * Math.exp(-t * 5);
      const noise = (Math.random() - 0.5) * 0.5;
      const envelope = Math.exp(-t * 6);
      data[i] = (Math.sin(2 * Math.PI * frequency * t) + noise) * envelope * 0.4;
    }

    return buffer;
  }



  /**
   * 播放背景音乐
   */
  public async playBGM(): Promise<void> {
    if (!this.isInitialized || this.isMuted) return;

    try {
      this.spaceMusicGenerator.setVolume(this.bgmVolume);
      await this.spaceMusicGenerator.startMusic();
      console.log('🎵 太空战斗BGM开始播放');
    } catch (error) {
      console.warn('BGM播放失败:', error);
      // 浏览器可能需要用户交互才能播放音频
      this.setupUserInteractionForAudio();
    }
  }

  /**
   * 停止背景音乐
   */
  public stopBGM(): void {
    this.spaceMusicGenerator.stopMusic();
    console.log('🎵 BGM已停止');
  }

  /**
   * 播放音效
   */
  public playSoundEffect(name: string): void {
    if (!this.isInitialized || this.isMuted || !this.audioContext) return;

    const buffer = this.soundEffects.get(name);
    if (buffer) {
      try {
        const source = this.audioContext.createBufferSource();
        const gainNode = this.audioContext.createGain();

        source.buffer = buffer;
        source.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        gainNode.gain.setValueAtTime(this.sfxVolume, this.audioContext.currentTime);
        source.start(0);
      } catch (error) {
        console.warn(`音效 ${name} 播放错误:`, error);
      }
    }
  }

  /**
   * 设置用户交互以启用音频
   */
  private setupUserInteractionForAudio(): void {
    const enableAudio = async () => {
      await this.playBGM();
      document.removeEventListener('click', enableAudio);
      document.removeEventListener('keydown', enableAudio);
    };

    document.addEventListener('click', enableAudio, { once: true });
    document.addEventListener('keydown', enableAudio, { once: true });

    console.log('🎵 等待用户交互以启用音频...');
  }

  /**
   * 切换静音状态
   */
  public async toggleMute(): Promise<boolean> {
    this.isMuted = !this.isMuted;

    if (this.isMuted) {
      this.stopBGM();
    } else {
      await this.playBGM();
    }

    return this.isMuted;
  }

  /**
   * 设置背景音乐音量
   */
  public setBGMVolume(volume: number): void {
    this.bgmVolume = Math.max(0, Math.min(1, volume));
    this.spaceMusicGenerator.setVolume(this.bgmVolume);
  }

  /**
   * 设置音效音量
   */
  public setSFXVolume(volume: number): void {
    this.sfxVolume = Math.max(0, Math.min(1, volume));
    // 音效音量在播放时设置
  }

  /**
   * 获取静音状态
   */
  public isMutedState(): boolean {
    return this.isMuted;
  }

  /**
   * 获取BGM播放状态
   */
  public isBGMPlaying(): boolean {
    return this.spaceMusicGenerator.getIsPlaying();
  }

  /**
   * 销毁音频管理器
   */
  public destroy(): void {
    this.stopBGM();
    this.spaceMusicGenerator.destroy();
    this.soundEffects.clear();

    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }

    this.isInitialized = false;
  }
}
