import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import styles from './Lightbox.module.css';

const Lightbox = ({ src, alt, onClose }) => {
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        const handler = (e) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handler);
        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', handler);
        };
    }, [onClose]);

    return (
        <div className={styles.overlay} onClick={onClose}>
            <button className={styles.close} onClick={onClose} aria-label="Schließen">
                <X size={20} />
            </button>
            <img
                src={src}
                alt={alt}
                className={styles.image}
                onClick={e => e.stopPropagation()}
            />
        </div>
    );
};

export default Lightbox;
