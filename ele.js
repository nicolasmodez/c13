function initMidrollLAd({
  videoSelector = '#video',
  containerSelector = '.player-container',
  imageUrl = '',
  showAt = 0.5,
  duration = 5000
} = {}) {
  // Inyectar estilos si aún no están
  if (!document.getElementById('midrollL-styles')) {
    const style = document.createElement("style");
    style.id = "midrollL-styles";
    style.innerHTML = `
      .video-wrapper {
        position: relative;
        width: 100%;
        height: 100%;
        transition: all 0.5s ease;
        z-index: 1;
      }
      .video-wrapper.shrink {
        width: 75%;
        height: 75%;
        position: absolute;
        top: 0;
        right: 0;
      }
      .ad-image {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        display: none;
        z-index: 2;
      }
      .ad-image.show {
        display: block;
      }
      .ad-image img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    `;
    document.head.appendChild(style);
  }

  const video = document.querySelector(videoSelector);
  if (!video) {
    console.warn(`No se encontró video con selector: ${videoSelector}`);
    return;
  }

  const container = video.closest(containerSelector);
  if (!container) {
    console.warn(`No se encontró contenedor con selector: ${containerSelector}`);
    return;
  }

  // Envolver el video si no está envuelto aún
  let wrapper;
  if (video.parentElement.classList.contains('video-wrapper')) {
    wrapper = video.parentElement;
  } else {
    wrapper = document.createElement('div');
    wrapper.className = 'video-wrapper';
    video.parentNode.insertBefore(wrapper, video);
    wrapper.appendChild(video);
  }

  // Crear el overlay de anuncio
  const adImage = document.createElement('div');
  adImage.className = 'ad-image';
  adImage.innerHTML = `<img src="${imageUrl}" alt="Publicidad en L">`;
  container.appendChild(adImage);

  // Lógica de midroll
  let adShown = false;
  video.addEventListener('timeupdate', () => {
    if (!adShown && video.duration > 0 && video.currentTime >= video.duration * showAt) {
      adShown = true;
      wrapper.classList.add('shrink');
      adImage.classList.add('show');

      setTimeout(() => {
        wrapper.classList.remove('shrink');
        adImage.classList.remove('show');
      }, duration);
    }
  });
}
