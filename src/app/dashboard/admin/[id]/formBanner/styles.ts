import styled from "styled-components";

export const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
`;

export const Form = styled.form`
  background: #fff;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const UploadCard = styled.label`
  border: 2px dashed #ccc;
  border-radius: 12px;
  padding: 32px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #ff7a00;
    background: #fff6ec;
  }

  input {
    display: none;
  }

  span {
    font-size: 16px;
    font-weight: 600;
    display: block;
  }

  small {
    font-size: 13px;
    color: #777;
  }
`;

export const ImagePreview = styled.div`
  position: relative;
  width: 100%;
  border-radius: 12px;
  overflow: hidden;

  img {
    width: 100%;
    object-fit: cover;
  }
`;

export const RemoveImageButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(0, 0, 0, 0.7);
  color: #fff;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;

  &:hover {
    background: #d32f2f;
  }
`;

export const Button = styled.button`
  background: #ff7a00;
  color: #fff;
  border: none;
  padding: 14px;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #e96f00;
  }

  &:disabled {
    background: #ffd2a6;
    cursor: not-allowed;
  }
`;

export const ProgressBarContainer = styled.div`
  height: 6px;
  background: #eee;
  border-radius: 4px;
  overflow: hidden;
`;

export const ProgressBar = styled.div<{ progress: number }>`
  height: 100%;
  width: ${({ progress }) => progress}%;
  background: #ff7a00;
  transition: width 0.15s linear;
`;

export const CropperOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const CropperContainer = styled.div`
  background: #fff;
  width: 90%;
  max-width: 700px;
  height: 500px;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
`;

export const CropperActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 12px;

  button {
    padding: 10px 16px;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    font-weight: 600;
  }

  .confirm {
    background: #ff7a00;
    color: #fff;
    z-index: 100;

    &:hover {
      background: #e96f00;
    }
  }

  .cancel {
    background: #eee;
    z-index: 100;
  }
`;
