import React, { useEffect } from 'react';

/**
 * Card3DTiltManager:
 * Global listener that applies subtle 3D tilt on hover across all cards.
 * 
 * Features:
 * 1. Perspective(800px) with 6-8 degree max tilt based on mouse position.
 * 2. Smooth 0.18s easing on cursor move, cleanly resetting flat on mouse leave.
 * 3. Preserves and layers over existing hover glow/lift effects.
 * 4. Zero layout shifts, purely CSS transform-driven.
 * 5. Disabled on touch and coarse-pointer devices.
 */
export default function Card3DTiltManager() {
  useEffect(() => {
    // Check if pointer is fine (desktop mouse)
    const isTouch = 
      typeof window !== 'undefined' && 
      (window.matchMedia('(pointer: coarse)').matches || 
       'ontouchstart' in window || 
       navigator.maxTouchPoints > 0);

    if (isTouch) return;

    let currentCard = null;

    const isCardElement = (el) => {
      if (!el) return false;
      const tag = el.tagName.toLowerCase();
      if (['main', 'section', 'header', 'footer', 'nav', 'body', 'html'].includes(tag)) {
        return false;
      }

      // Never tilt headers, navigation, large hero containers, or modals/dialogs
      if (
        el.closest('header, nav') || 
        el.querySelector('header, nav') || 
        el.id === 'home' ||
        el.closest('[role="dialog"]') ||
        el.closest('[data-no-tilt]') ||
        el.closest('.modal-card') ||
        el.hasAttribute('data-no-tilt')
      ) {
        return false;
      }

      // Check card class markers or data-tilt
      const hasCardClass = 
        el.classList.contains('rounded-2xl') || 
        el.classList.contains('rounded-xl') || 
        el.hasAttribute('data-tilt') ||
        (el.classList.contains('hover-glow-lift') && !el.classList.contains('inline-flex'));

      if (!hasCardClass) return false;

      // Card dimensions only (avoids huge page/hero wrappers)
      const rect = el.getBoundingClientRect();
      return rect.width >= 140 && rect.width <= 700 && rect.height >= 55 && rect.height <= 420;
    };

    const handleMouseMove = (e) => {
      // Immediately ignore if cursor is inside any modal or dialog
      if (e.target.closest('[role="dialog"], [data-no-tilt], .modal-card')) {
        if (currentCard) {
          resetCard(currentCard);
          currentCard = null;
        }
        return;
      }

      const target = e.target.closest('.rounded-2xl, .rounded-xl, [data-tilt], .hover-glow-lift');
      
      if (target && isCardElement(target)) {
        if (currentCard && currentCard !== target) {
          // Reset previous card
          resetCard(currentCard);
        }
        currentCard = target;

        const rect = target.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Normalized offsets from center (-1 to 1)
        const percentX = (x / rect.width) * 2 - 1;
        const percentY = (y / rect.height) * 2 - 1;

        // Max tilt 7 degrees (within 6-8 deg prompt spec)
        const maxTilt = 7;
        const rotateX = (-percentY * maxTilt).toFixed(2);
        const rotateY = (percentX * maxTilt).toFixed(2);

        target.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        target.style.transition = 'transform 0.18s cubic-bezier(0.16, 1, 0.3, 1)';
        target.style.transformStyle = 'preserve-3d';
      } else if (currentCard) {
        resetCard(currentCard);
        currentCard = null;
      }
    };

    const resetCard = (card) => {
      if (!card) return;
      card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0px)';
      card.style.transition = 'transform 0.25s ease-out';
      setTimeout(() => {
        if (card && currentCard !== card) {
          card.style.transform = '';
          card.style.transition = '';
          card.style.transformStyle = '';
        }
      }, 250);
    };

    const handleMouseLeaveWindow = () => {
      if (currentCard) {
        resetCard(currentCard);
        currentCard = null;
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeaveWindow, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeaveWindow);
      if (currentCard) {
        resetCard(currentCard);
      }
    };
  }, []);

  return null;
}
