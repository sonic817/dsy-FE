"use client";

import Modal from "./Modal";

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  src: string;
  alt: string;
}

export default function ImageModal({ isOpen, onClose, src, alt }: ImageModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={alt}>
      <img
        src={src}
        alt={alt}
        style={{ width: "100%", borderRadius: 8 }}
      />
    </Modal>
  );
}
