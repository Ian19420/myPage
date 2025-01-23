particlesJS.load('particlesjs-config-js', '/javascripts/particlesjs-config.json', function() {
    console.log('callback - particles.js config loaded');
})
let isAboutVisible = false;
let isProjectsVisible = false;
let isImagesVisible = true;
let imageInterval = setInterval(showNextImage, 3000);

const aboutLink = document.querySelector('a[href="#about"]');
const aboutSection = document.getElementById('about');

const projectsLink = document.querySelector('a[href="#projects"]');
const projectsSection = document.getElementById('projects');

const homeLink = document.querySelector('a[href="#hero"]');
const images = document.querySelectorAll('.images');
function toggleSection(section, isVisible, flag) {
    if (isVisible) {
        section.style.opacity = 0;
        setTimeout(function () {
            section.style.display = 'none';
        }, 1000);
    } else {
        section.style.display = 'block';
        setTimeout(function () {
            section.style.opacity = 1;
        }, 10);
    }
    flag = !flag;
    return flag;
}
function handleAboutLink(event) {
    event.preventDefault();
    if (isProjectsVisible) {
        isProjectsVisible = toggleSection(projectsSection, isProjectsVisible, isProjectsVisible);
    }
    isAboutVisible = toggleSection(aboutSection, isAboutVisible, isAboutVisible);
    if (isImagesVisible) {
        images.forEach(image => {
            image.style.display = 'none';
        });
        clearInterval(imageInterval);
        isImagesVisible = false;
     }
}
function handleProjectsLink(event) {
    event.preventDefault();
    if (isAboutVisible) {
        isAboutVisible = toggleSection(aboutSection, isAboutVisible, isAboutVisible);
    }
    isProjectsVisible = toggleSection(projectsSection, isProjectsVisible, isProjectsVisible);
    if (isImagesVisible) {
        images.forEach(image => {
            image.style.display = 'none';
        });
        clearInterval(imageInterval);
        isImagesVisible = false;
     }
}
function handleHomeLink(event) {
    event.preventDefault();
    if (isAboutVisible) {
        isAboutVisible = toggleSection(aboutSection, isAboutVisible, isAboutVisible);
    }
    if (isProjectsVisible) {
        isProjectsVisible = toggleSection(projectsSection, isProjectsVisible, isProjectsVisible);
    }
    if (!isImagesVisible) {
        images.forEach(image => {
            image.style.display = 'block';
        });
        imageInterval = setInterval(showNextImage, 3000);
        isImagesVisible = true;
    }
}
aboutLink.addEventListener('click', handleAboutLink);
aboutLink.addEventListener('touchstart', handleAboutLink);

projectsLink.addEventListener('click', handleProjectsLink);
projectsLink.addEventListener('touchstart', handleProjectsLink);

homeLink.addEventListener('click', handleHomeLink);
homeLink.addEventListener('touchstart', handleHomeLink);

let currentIndex = 0;

function showNextImage() {
    images[currentIndex].classList.remove("visible");
    images[currentIndex].classList.add("hidden");
    currentIndex = (currentIndex + 1) % images.length;
    images[currentIndex].classList.remove("hidden");
    images[currentIndex].classList.add("visible");
}