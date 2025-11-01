import { Hands, HAND_CONNECTIONS } from '@mediapipe/hands';
import type { Results } from '@mediapipe/hands';
import { Camera } from '@mediapipe/camera_utils';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import { HandSign } from '@jutsu-clash/shared';

export interface GestureResult {
  gesture: HandSign | null;
  confidence: number;
  landmarks: any;
}

export class GestureRecognizer {
  private hands: Hands | null = null;
  private camera: Camera | null = null;
  private videoElement: HTMLVideoElement | null = null;
  private canvasElement: HTMLCanvasElement | null = null;
  private canvasCtx: CanvasRenderingContext2D | null = null;
  private onGestureCallback: ((result: GestureResult) => void) | null = null;
  private isRunning = false;
  private confidenceThreshold = 0.85;

  async initialize(
    videoElement: HTMLVideoElement,
    canvasElement: HTMLCanvasElement,
    onGesture: (result: GestureResult) => void
  ): Promise<void> {
    this.videoElement = videoElement;
    this.canvasElement = canvasElement;
    this.canvasCtx = canvasElement.getContext('2d');
    this.onGestureCallback = onGesture;

    // Initialize MediaPipe Hands
    this.hands = new Hands({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
      },
    });

    this.hands.setOptions({
      maxNumHands: 2,
      modelComplexity: 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.7,
    });

    this.hands.onResults((results) => this.onResults(results));

    // Set up camera
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: 1280,
          height: 720,
          facingMode: 'user',
        },
      });

      videoElement.srcObject = stream;
      await videoElement.play();

      this.camera = new Camera(videoElement, {
        onFrame: async () => {
          if (this.hands && this.isRunning) {
            await this.hands.send({ image: videoElement });
          }
        },
        width: 1280,
        height: 720,
      });
    } catch (error) {
      console.error('Error accessing webcam:', error);
      throw error;
    }
  }

  start(): void {
    if (this.camera && !this.isRunning) {
      this.isRunning = true;
      this.camera.start();
    }
  }

  stop(): void {
    this.isRunning = false;
    if (this.camera) {
      this.camera.stop();
    }
  }

  setConfidenceThreshold(threshold: number): void {
    this.confidenceThreshold = Math.max(0, Math.min(1, threshold));
  }

  private onResults(results: Results): void {
    if (!this.canvasElement || !this.canvasCtx) return;

    // Clear canvas
    this.canvasCtx.save();
    this.canvasCtx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
    this.canvasCtx.drawImage(
      results.image,
      0,
      0,
      this.canvasElement.width,
      this.canvasElement.height
    );

    // Draw hand landmarks
    if (results.multiHandLandmarks && results.multiHandedness) {
      for (let i = 0; i < results.multiHandLandmarks.length; i++) {
        const landmarks = results.multiHandLandmarks[i];
        const handedness = results.multiHandedness[i];

        // Draw connections and landmarks
        drawConnectors(this.canvasCtx, landmarks, HAND_CONNECTIONS, {
          color: '#00FF00',
          lineWidth: 2,
        });
        drawLandmarks(this.canvasCtx, landmarks, { color: '#FF0000', lineWidth: 1 });

        // Recognize gesture
        const gestureResult = this.recognizeGesture(landmarks, handedness.label);

        if (this.onGestureCallback) {
          this.onGestureCallback(gestureResult);
        }
      }
    } else {
      // No hands detected
      if (this.onGestureCallback) {
        this.onGestureCallback({
          gesture: null,
          confidence: 0,
          landmarks: null,
        });
      }
    }

    this.canvasCtx.restore();
  }

  private recognizeGesture(landmarks: any, _handedness: string): GestureResult {
    // This is a simplified gesture recognition system
    // In production, you would use a trained ML model or more sophisticated algorithm

    const fingerTips = [4, 8, 12, 16, 20]; // Thumb, Index, Middle, Ring, Pinky tips
    const fingerMCPs = [2, 5, 9, 13, 17]; // Metacarpophalangeal joints

    // Calculate which fingers are extended
    const extendedFingers = fingerTips.map((tip, index) => {
      const tipY = landmarks[tip].y;
      const mcpY = landmarks[fingerMCPs[index]].y;
      return tipY < mcpY; // Finger extended if tip is above MCP
    });

    // Calculate finger angles and positions for gesture recognition
    const gesture = this.matchGesturePattern(landmarks, extendedFingers);

    return {
      gesture: gesture.sign,
      confidence: gesture.confidence,
      landmarks,
    };
  }

  private matchGesturePattern(
    _landmarks: any,
    extendedFingers: boolean[]
  ): { sign: HandSign | null; confidence: number } {
    // Simplified pattern matching for the 12 zodiac hand signs
    // This would be replaced with actual ML model or detailed geometric analysis

    const patterns = [
      {
        sign: HandSign.RAT,
        check: () => extendedFingers[1] && extendedFingers[2] && !extendedFingers[3] && !extendedFingers[4],
        confidence: 0.9,
      },
      {
        sign: HandSign.OX,
        check: () => extendedFingers.every((f) => f),
        confidence: 0.95,
      },
      {
        sign: HandSign.TIGER,
        check: () => !extendedFingers[0] && extendedFingers.slice(1).every((f) => f),
        confidence: 0.92,
      },
      {
        sign: HandSign.RABBIT,
        check: () => extendedFingers[1] && extendedFingers[2] && !extendedFingers[3],
        confidence: 0.88,
      },
      {
        sign: HandSign.DRAGON,
        check: () => extendedFingers[0] && !extendedFingers[1] && extendedFingers[2],
        confidence: 0.85,
      },
      {
        sign: HandSign.SNAKE,
        check: () => !extendedFingers.some((f) => f),
        confidence: 0.97,
      },
      {
        sign: HandSign.HORSE,
        check: () => extendedFingers[1] && extendedFingers[4],
        confidence: 0.87,
      },
      {
        sign: HandSign.RAM,
        check: () => extendedFingers[2] && extendedFingers[3],
        confidence: 0.89,
      },
      {
        sign: HandSign.MONKEY,
        check: () => extendedFingers[0] && extendedFingers[4],
        confidence: 0.86,
      },
      {
        sign: HandSign.BIRD,
        check: () => extendedFingers[1] && extendedFingers[2] && extendedFingers[3] && extendedFingers[4],
        confidence: 0.93,
      },
      {
        sign: HandSign.DOG,
        check: () => extendedFingers[1] && !extendedFingers[2] && !extendedFingers[3],
        confidence: 0.88,
      },
      {
        sign: HandSign.BOAR,
        check: () => extendedFingers[0] && extendedFingers[1],
        confidence: 0.84,
      },
    ];

    for (const pattern of patterns) {
      if (pattern.check()) {
        return { sign: pattern.sign, confidence: pattern.confidence };
      }
    }

    return { sign: null, confidence: 0 };
  }

  dispose(): void {
    this.stop();
    if (this.videoElement && this.videoElement.srcObject) {
      const stream = this.videoElement.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
    }
    this.hands?.close();
  }
}
