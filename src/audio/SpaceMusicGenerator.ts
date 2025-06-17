/**
 * 太空音乐生成器 - 使用Web Audio API生成太空主题背景音乐
 * 创建科幻、神秘的太空战斗氛围音乐
 * 作者: 9531lyj
 * 邮箱: 2233613389@qq.com
 */

export class SpaceMusicGenerator {
  private audioContext: AudioContext | null = null;
  private isPlaying: boolean = false;
  private masterGain: GainNode | null = null;
  private volume: number = 0.3;

  constructor() {
    this.initializeAudioContext();
  }

  /**
   * 初始化音频上下文
   */
  private initializeAudioContext(): void {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.masterGain = this.audioContext.createGain();
      this.masterGain.connect(this.audioContext.destination);
      this.masterGain.gain.setValueAtTime(this.volume, this.audioContext.currentTime);
      
      console.log('🎵 太空音乐生成器初始化完成');
    } catch (error) {
      console.warn('音频上下文初始化失败:', error);
    }
  }

  /**
   * 创建振荡器
   */
  private createOscillator(frequency: number, type: OscillatorType = 'sine'): OscillatorNode {
    if (!this.audioContext) throw new Error('音频上下文未初始化');
    
    const oscillator = this.audioContext.createOscillator();
    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
    oscillator.type = type;
    return oscillator;
  }

  /**
   * 创建增益节点
   */
  private createGainNode(initialGain: number = 0): GainNode {
    if (!this.audioContext) throw new Error('音频上下文未初始化');
    
    const gainNode = this.audioContext.createGain();
    gainNode.gain.setValueAtTime(initialGain, this.audioContext.currentTime);
    return gainNode;
  }

  /**
   * 创建低频太空氛围音
   */
  private createAmbientDrone(): void {
    if (!this.audioContext || !this.masterGain) return;

    const drone1 = this.createOscillator(55, 'sine'); // A1
    const drone2 = this.createOscillator(82.4, 'sine'); // E2
    const drone3 = this.createOscillator(110, 'triangle'); // A2

    const droneGain = this.createGainNode(0);

    drone1.connect(droneGain);
    drone2.connect(droneGain);
    drone3.connect(droneGain);
    droneGain.connect(this.masterGain!);
    
    // 缓慢淡入
    const currentTime = this.audioContext.currentTime;
    droneGain.gain.linearRampToValueAtTime(0.15, currentTime + 3);
    
    drone1.start(currentTime);
    drone2.start(currentTime);
    drone3.start(currentTime);
    
    // 添加轻微的频率调制
    const lfo = this.createOscillator(0.1, 'sine');
    const lfoGain = this.createGainNode(2);
    
    lfo.connect(lfoGain);
    lfoGain.connect(drone1.frequency);
    lfo.start(currentTime);
  }

  /**
   * 创建太空旋律
   */
  private createSpaceMelody(): void {
    if (!this.audioContext || !this.masterGain) return;

    const notes = [
      { freq: 220, duration: 2 },   // A3
      { freq: 246.94, duration: 1.5 }, // B3
      { freq: 277.18, duration: 2 },   // C#4
      { freq: 329.63, duration: 1 },   // E4
      { freq: 369.99, duration: 2.5 }, // F#4
      { freq: 329.63, duration: 1 },   // E4
      { freq: 277.18, duration: 2 },   // C#4
      { freq: 246.94, duration: 1.5 }  // B3
    ];

    let startTime = this.audioContext.currentTime + 2;

    const playMelodyLoop = () => {
      if (!this.isPlaying || !this.audioContext || !this.masterGain) return;

      notes.forEach((note, index) => {
        const oscillator = this.createOscillator(note.freq, 'triangle');
        const gainNode = this.createGainNode(0);
        
        // 添加滤波器创造太空感
        const filter = this.audioContext!.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, startTime + index * 0.8);
        filter.Q.setValueAtTime(5, startTime + index * 0.8);
        
        oscillator.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.masterGain!);
        
        // 音符包络
        const noteStart = startTime + index * 0.8;
        const noteEnd = noteStart + note.duration;
        
        gainNode.gain.setValueAtTime(0, noteStart);
        gainNode.gain.linearRampToValueAtTime(0.1, noteStart + 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.05, noteEnd - 0.2);
        gainNode.gain.linearRampToValueAtTime(0, noteEnd);
        
        oscillator.start(noteStart);
        oscillator.stop(noteEnd);
      });

      // 计算下一次循环的开始时间
      const totalDuration = notes.reduce((sum, note) => sum + note.duration * 0.8, 0);
      startTime += totalDuration;
      
      // 设置下一次循环
      setTimeout(playMelodyLoop, totalDuration * 1000);
    };

    playMelodyLoop();
  }

  /**
   * 创建太空打击乐
   */
  private createSpacePercussion(): void {
    if (!this.audioContext || !this.masterGain) return;

    const createKick = (time: number) => {
      const oscillator = this.createOscillator(60, 'sine');
      const gainNode = this.createGainNode(0);
      
      oscillator.connect(gainNode);
      gainNode.connect(this.masterGain!);
      
      gainNode.gain.setValueAtTime(0.3, time);
      gainNode.gain.exponentialRampToValueAtTime(0.01, time + 0.3);
      
      oscillator.frequency.setValueAtTime(60, time);
      oscillator.frequency.exponentialRampToValueAtTime(30, time + 0.3);
      
      oscillator.start(time);
      oscillator.stop(time + 0.3);
    };

    const createHiHat = (time: number) => {
      const noise = this.audioContext!.createBufferSource();
      const buffer = this.audioContext!.createBuffer(1, this.audioContext!.sampleRate * 0.1, this.audioContext!.sampleRate);
      const data = buffer.getChannelData(0);
      
      for (let i = 0; i < data.length; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      
      noise.buffer = buffer;
      
      const filter = this.audioContext!.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(8000, time);
      
      const gainNode = this.createGainNode(0);
      
      noise.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(this.masterGain!);
      
      gainNode.gain.setValueAtTime(0.1, time);
      gainNode.gain.exponentialRampToValueAtTime(0.01, time + 0.1);
      
      noise.start(time);
    };

    // 打击乐循环
    const playPercussionLoop = () => {
      if (!this.isPlaying || !this.audioContext) return;

      const currentTime = this.audioContext.currentTime;
      const beatDuration = 0.5; // 每拍0.5秒
      
      // 踢鼓模式：1, 3拍
      createKick(currentTime);
      createKick(currentTime + beatDuration * 2);
      
      // Hi-hat模式：2, 4拍
      createHiHat(currentTime + beatDuration);
      createHiHat(currentTime + beatDuration * 3);
      
      // 每4拍重复一次
      setTimeout(playPercussionLoop, beatDuration * 4 * 1000);
    };

    // 延迟开始打击乐
    setTimeout(playPercussionLoop, 4000);
  }

  /**
   * 开始播放太空音乐
   */
  public async startMusic(): Promise<void> {
    if (!this.audioContext) {
      this.initializeAudioContext();
    }

    if (this.audioContext?.state === 'suspended') {
      await this.audioContext.resume();
    }

    if (this.isPlaying) return;

    this.isPlaying = true;
    
    console.log('🎵 开始播放太空战斗音乐');
    
    // 创建各种音乐层
    this.createAmbientDrone();
    this.createSpaceMelody();
    this.createSpacePercussion();
  }

  /**
   * 停止播放音乐
   */
  public stopMusic(): void {
    this.isPlaying = false;
    
    if (this.audioContext) {
      // 淡出效果
      if (this.masterGain) {
        const currentTime = this.audioContext.currentTime;
        this.masterGain.gain.linearRampToValueAtTime(0, currentTime + 1);
        
        setTimeout(() => {
          if (this.masterGain) {
            this.masterGain.gain.setValueAtTime(this.volume, this.audioContext!.currentTime);
          }
        }, 1000);
      }
    }
    
    console.log('🎵 太空音乐已停止');
  }

  /**
   * 设置音量
   */
  public setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume));
    
    if (this.masterGain && this.audioContext) {
      this.masterGain.gain.setValueAtTime(this.volume, this.audioContext.currentTime);
    }
  }

  /**
   * 获取播放状态
   */
  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  /**
   * 销毁音乐生成器
   */
  public destroy(): void {
    this.stopMusic();
    
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    
    this.masterGain = null;
  }
}
