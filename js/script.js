
    
        // Project Navigation
        const projectBtns = document.querySelectorAll('.project-btn');
        const projectSections = document.querySelectorAll('.project-section');
        
        projectBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons and sections
                projectBtns.forEach(b => b.classList.remove('active'));
                projectSections.forEach(s => s.classList.remove('active'));
                
                // Add active class to clicked button
                btn.classList.add('active');
                
                // Show corresponding section
                const target = btn.getAttribute('data-target');
                document.getElementById(target).classList.add('active');
            });
        });
        
        // Image Gallery
        const galleryItems = document.querySelectorAll('.gallery-item');
        const lightbox = document.querySelector('.lightbox');
        const lightboxImg = document.querySelector('.lightbox-content img');
        const lightboxClose = document.querySelector('.lightbox-close');
        const lightboxPrev = document.querySelector('#lightbox-prev');
        const lightboxNext = document.querySelector('#lightbox-next');
        let currentImageIndex = 0;
        
        // Open lightbox when clicking on an image
        galleryItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                currentImageIndex = index;
                lightboxImg.src = item.querySelector('img').src;
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });
        
        // Close lightbox
        lightboxClose.addEventListener('click', () => {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        });
        
        // Next image
        lightboxNext.addEventListener('click', () => {
            currentImageIndex = (currentImageIndex + 1) % galleryItems.length;
            lightboxImg.src = galleryItems[currentImageIndex].querySelector('img').src;
        });
        
        // Previous image
        lightboxPrev.addEventListener('click', () => {
            currentImageIndex = (currentImageIndex - 1 + galleryItems.length) % galleryItems.length;
            lightboxImg.src = galleryItems[currentImageIndex].querySelector('img').src;
        });
        
        // Close lightbox when clicking outside image
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
        
        // Keyboard navigation for gallery
        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('active')) {
                if (e.key === 'ArrowRight') {
                    lightboxNext.click();
                } else if (e.key === 'ArrowLeft') {
                    lightboxPrev.click();
                } else if (e.key === 'Escape') {
                    lightboxClose.click();
                }
            }
        });
        
        // Next/Prev buttons for gallery navigation
        const galleryNextBtn = document.getElementById('next-btn');
        const galleryPrevBtn = document.getElementById('prev-btn');
        
        galleryNextBtn.addEventListener('click', () => {
            lightboxNext.click();
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
        
        galleryPrevBtn.addEventListener('click', () => {
            lightboxPrev.click();
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
        
        // Calculator
        const display = document.getElementById('display');
        const history = document.getElementById('history');
        const buttons = document.querySelectorAll('.calc-btn');
        let currentInput = '0';
        let firstOperand = null;
        let operator = null;
        let waitingForSecondOperand = false;
        
        function updateDisplay() {
            display.textContent = currentInput;
        }
        
        function inputDigit(digit) {
            if (waitingForSecondOperand) {
                currentInput = digit;
                waitingForSecondOperand = false;
            } else {
                currentInput = currentInput === '0' ? digit : currentInput + digit;
            }
        }
        
        function inputDecimal() {
            if (waitingForSecondOperand) return;
            
            if (!currentInput.includes('.')) {
                currentInput += '.';
            }
        }
        
        function handleOperator(nextOperator) {
            const inputValue = parseFloat(currentInput);
            
            if (operator && waitingForSecondOperand) {
                operator = nextOperator;
                history.textContent = `${firstOperand} ${operator}`;
                return;
            }
            
            if (firstOperand === null) {
                firstOperand = inputValue;
            } else if (operator) {
                const result = performCalculation();
                currentInput = String(result);
                firstOperand = result;
            }
            
            waitingForSecondOperand = true;
            operator = nextOperator;
            history.textContent = `${firstOperand} ${operator}`;
        }
        
        function performCalculation() {
            const firstValue = firstOperand;
            const secondValue = parseFloat(currentInput);
            
            if (isNaN(firstValue) || isNaN(secondValue)) return;
            
            switch (operator) {
                case '+':
                    return firstValue + secondValue;
                case '-':
                    return firstValue - secondValue;
                case '*':
                    return firstValue * secondValue;
                case '/':
                    return firstValue / secondValue;
                case '%':
                    return firstValue % secondValue;
                default:
                    return secondValue;
            }
        }
        
        function resetCalculator() {
            currentInput = '0';
            firstOperand = null;
            operator = null;
            waitingForSecondOperand = false;
            history.textContent = '';
        }
        
        function backspace() {
            if (currentInput.length === 1) {
                currentInput = '0';
            } else {
                currentInput = currentInput.slice(0, -1);
            }
        }
        
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                const value = button.getAttribute('data-value');
                
                if (value === 'clear') {
                    resetCalculator();
                } else if (value === 'backspace') {
                    backspace();
                } else if (value === '.') {
                    inputDecimal();
                } else if (value === '=') {
                    if (operator) {
                        const result = performCalculation();
                        currentInput = String(result);
                        history.textContent = '';
                        firstOperand = null;
                        operator = null;
                        waitingForSecondOperand = false;
                    }
                } else if (['+', '-', '*', '/', '%'].includes(value)) {
                    handleOperator(value);
                } else {
                    inputDigit(value);
                }
                
                updateDisplay();
            });
        });
        
        // Keyboard support for calculator
        document.addEventListener('keydown', (e) => {
            if (e.key >= '0' && e.key <= '9') {
                inputDigit(e.key);
                updateDisplay();
            } else if (e.key === '.') {
                inputDecimal();
                updateDisplay();
            } else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
                handleOperator(e.key);
                updateDisplay();
            } else if (e.key === 'Enter' || e.key === '=') {
                if (operator) {
                    const result = performCalculation();
                    currentInput = String(result);
                    history.textContent = '';
                    firstOperand = null;
                    operator = null;
                    waitingForSecondOperand = false;
                    updateDisplay();
                }
            } else if (e.key === 'Escape') {
                resetCalculator();
                updateDisplay();
            } else if (e.key === 'Backspace') {
                backspace();
                updateDisplay();
            } else if (e.key === '%') {
                handleOperator('%');
                updateDisplay();
            }
        });
        
        // Music Player
        const playBtn = document.getElementById('play-btn');
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        const progressBar = document.getElementById('progress-bar');
        const progress = document.getElementById('progress');
        const currentTimeEl = document.getElementById('current-time');
        const durationEl = document.getElementById('duration');
        const volumeBar = document.getElementById('volume-bar');
        const volumeProgress = document.getElementById('volume-progress');
        const playlistItems = document.querySelectorAll('.playlist-item');
        const songTitle = document.querySelector('.song-title');
        const songArtist = document.querySelector('.song-artist');
        const albumArt = document.querySelector('.album-art img');
        
        // Song data
        const songs = [
            {
                title: 'Electric Dreams',
                artist: 'Neon Waves',
                duration: '3:45',
                cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&auto=format&fit=crop&w=700&h=700'
            },
            {
                title: 'Summer Vibes',
                artist: 'Tropical Beats',
                duration: '4:20',
                cover: 'https://images.unsplash.com/photo-1494232410401-ad00d5433cfa?ixlib=rb-4.0.3&auto=format&fit=crop&w=700&h=700'
            },
            {
                title: 'Midnight Drive',
                artist: 'Urban Echoes',
                duration: '3:55',
                cover: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=700&h=700'
            },
            {
                title: 'Starlight',
                artist: 'Cosmic Harmony',
                duration: '4:10',
                cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=700&h=700'
            }
        ];
        
        let currentSong = 0;
        let isPlaying = false;
        
        // Play/Pause functionality
        function togglePlay() {
            isPlaying = !isPlaying;
            playBtn.innerHTML = isPlaying ? '<i class="fas fa-pause"></i>' : '<i class="fas fa-play"></i>';
        }
        
        playBtn.addEventListener('click', togglePlay);
        
        // Update song info
        function loadSong(index) {
            const song = songs[index];
            songTitle.textContent = song.title;
            songArtist.textContent = song.artist;
            albumArt.src = song.cover;
            durationEl.textContent = song.duration;
            
            // Update active playlist item
            playlistItems.forEach(item => item.classList.remove('active'));
            playlistItems[index].classList.add('active');
        }
        
        // Next song
        function nextSong() {
            currentSong = (currentSong + 1) % songs.length;
            loadSong(currentSong);
            if (isPlaying) {
                // In a real app, you would play the new song here
            }
        }
        
        // Previous song
        function prevSong() {
            currentSong = (currentSong - 1 + songs.length) % songs.length;
            loadSong(currentSong);
            if (isPlaying) {
                // In a real app, you would play the new song here
            }
        }
        
        nextBtn.addEventListener('click', nextSong);
        prevBtn.addEventListener('click', prevSong);
        
        // Progress bar
        progressBar.addEventListener('click', (e) => {
            const width = progressBar.clientWidth;
            const clickX = e.offsetX;
            const duration = 225; // Total song duration in seconds
            
            // In a real app, you would set the current time of the audio
            const percent = clickX / width;
            progress.style.width = `${percent * 100}%`;
            
            // Update current time display
            const currentSeconds = Math.floor(percent * duration);
            const minutes = Math.floor(currentSeconds / 60);
            const seconds = currentSeconds % 60;
            currentTimeEl.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        });
        
        // Volume control
        volumeBar.addEventListener('click', (e) => {
            const width = volumeBar.clientWidth;
            const clickX = e.offsetX;
            const percent = clickX / width;
            volumeProgress.style.width = `${percent * 100}%`;
        });
        
        // Click on playlist item
        playlistItems.forEach(item => {
            item.addEventListener('click', () => {
                const index = parseInt(item.getAttribute('data-song'));
                currentSong = index;
                loadSong(currentSong);
                if (!isPlaying) {
                    togglePlay();
                }
            });
        });
        
        // Initialize the player
        loadSong(currentSong);
        
        // Simulate progress for demo purposes
        setInterval(() => {
            if (isPlaying) {
                const progressPercent = (parseInt(currentTimeEl.textContent.split(':')[1]) + 1) / 225 * 100;
                if (progressPercent < 100) {
                    progress.style.width = `${progressPercent}%`;
                    
                    // Update current time
                    const currentSeconds = Math.floor(225 * progressPercent / 100);
                    const minutes = Math.floor(currentSeconds / 60);
                    const seconds = currentSeconds % 60;
                    currentTimeEl.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
                } else {
                    nextSong();
                    progress.style.width = '0%';
                    currentTimeEl.textContent = '0:00';
                }
            }
        }, 1000);
    
