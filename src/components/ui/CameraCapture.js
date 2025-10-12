
import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import { Camera, X, RefreshCw } from 'lucide-react';
import { theme } from '../../styles/theme';
import { Button } from './Button';

const CaptureContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
`;

const VideoContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 400px;
  border-radius: ${theme.borderRadius.large};
  overflow: hidden;
  background: ${theme.colors.primary.dark};
  
  video, canvas {
    width: 100%;
    height: auto;
    display: block;
  }
`;

const ControlsContainer = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  justify-content: center;
  flex-wrap: wrap;
`;

export const CameraCapture = ({ onCapture, preview, onRemove }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [capturing, setCapturing] = useState(false);
  
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setCapturing(true);
    } catch (error) {
      console.error('Erro ao acessar câmera:', error);
      alert('Não foi possível acessar a câmera');
    }
  };
  
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setCapturing(false);
  };
  
  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);
      
      canvas.toBlob((blob) => {
        if (onCapture) {
          const file = new File([blob], 'camera-photo.jpg', { type: 'image/jpeg' });
          onCapture(file);
        }
        stopCamera();
      }, 'image/jpeg');
    }
  };
  
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);
  
  if (preview) {
    return (
      <CaptureContainer>
        <VideoContainer>
          <img src={preview} alt="Preview" />
        </VideoContainer>
        <ControlsContainer>
          <Button variant="secondary" onClick={onRemove} type="button">
            <X size={20} />
            Remover
          </Button>
          <Button variant="secondary" onClick={startCamera} type="button">
            <RefreshCw size={20} />
            Tirar nova foto
          </Button>
        </ControlsContainer>
      </CaptureContainer>
    );
  }
  
  return (
    <CaptureContainer>
      <VideoContainer>
        {capturing ? (
          <video ref={videoRef} autoPlay playsInline />
        ) : (
          <div style={{ padding: theme.spacing.xl, textAlign: 'center', color: theme.colors.neutral.mediumGray }}>
            <Camera size={48} />
            <p>Câmera desativada</p>
          </div>
        )}
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </VideoContainer>
      <ControlsContainer>
        {!capturing ? (
          <Button variant="primary" onClick={startCamera} type="button">
            <Camera size={20} />
            Ativar Câmera
          </Button>
        ) : (
          <>
            <Button variant="primary" onClick={capturePhoto} type="button">
              <Camera size={20} />
              Capturar Foto
            </Button>
            <Button variant="secondary" onClick={stopCamera} type="button">
              <X size={20} />
              Cancelar
            </Button>
          </>
        )}
      </ControlsContainer>
    </CaptureContainer>
  );
};
