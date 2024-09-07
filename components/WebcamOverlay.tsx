import React, { useRef, useEffect, useState } from "react";
import * as faceapi from "face-api.js";

const WebcamOverlay = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [maskImg, setMaskImg] = useState<HTMLImageElement | null>(null);

    useEffect(() => {
        const loadModels = async () => {
            await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
            await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
        };

        const startVideo = () => {
            navigator.mediaDevices.getUserMedia({ video: {} })
                .then((stream) => {
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                    }
                })
                .catch((err) => console.error("Error accessing webcam:", err));
        };

        const loadMaskImage = () => {
            const img = new Image();
            img.src = "/mask.png";
            img.onload = () => setMaskImg(img);
        };

        loadModels();
        startVideo();
        loadMaskImage();
    }, []);

    useEffect(() => {
        const detectFace = async () => {
            if (videoRef.current && canvasRef.current) {
                const video = videoRef.current;
                const canvas = canvasRef.current;
                const displaySize = { width: video.width, height: video.height };
                faceapi.matchDimensions(canvas, displaySize);

                setInterval(async () => {
                    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
                        .withFaceLandmarks();

                    const resizedDetections = faceapi.resizeResults(detections, displaySize);
                    const context = canvas.getContext("2d");
                    context?.clearRect(0, 0, canvas.width, canvas.height);

                    resizedDetections.forEach(detection => {
                        const box = detection.detection.box;
                        if (maskImg) {
                            context?.drawImage(maskImg, box.x, box.y - 100, box.width, box.height + 100); // 顔の上にマスクを描画
                        }
                    });
                }, 100);
            }
        };

        detectFace();
    }, [maskImg]);

    return (
        <div>
            <video ref={videoRef} autoPlay muted width="720" height="560" style={{ position: "absolute" }} />
            <canvas ref={canvasRef} width="720" height="560" style={{ position: "absolute" }} />
        </div>
    );
};

export default WebcamOverlay;
