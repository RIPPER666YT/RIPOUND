document.addEventListener("DOMContentLoaded", function () {
    const titleScreen = document.getElementById("title-screen");
    const playerScreen = document.getElementById("player-screen");
    const audioPlayer = document.getElementById("audio-player");
    const playPauseButton = document.getElementById("play-pause-button");
    const playPauseIcon = document.querySelector('.play-pause-icon');
    const audioSource = document.getElementById("audio-source");
    const timeSlider = document.getElementById("time-slider");
    const playlistElement = document.getElementById("playlist");
    const currentTimeDisplay = document.querySelector('.current-time'); // Элемент для текущего времени
    const durationTimeDisplay = document.querySelector('.duration-time'); // Элемент для максимального времени

    let playlist = []; // Инициализируем пустой плейлист

    // Показать титульный экран
    titleScreen.style.opacity = 1;

    // Через 3 секунды скрыть титульный экран и показать плеер
    setTimeout(() => {
        titleScreen.style.opacity = 0;

        // После того как титульный экран исчезнет
        setTimeout(() => {
            titleScreen.classList.add("hidden"); // Скрыть титульный экран
            playerScreen.classList.remove("hidden"); // Показать плеер
            playerScreen.style.opacity = 1; // Показать плеер с плавным переходом
        }, 1000); // Задержка для плавного исчезновения титульного экрана
    }, 3000);

    // Обработка загрузки аудиофайлов из папки
    document.getElementById("audio-file").addEventListener("change", function (event) {
        const files = event.target.files; // Получаем все файлы из папки

        for (let i = 0; i < files.length; i++) {
            const file = files[i];

            // Проверяем, является ли файл аудиофайлом
            if (file.type.startsWith("audio/")) {
                const url = URL.createObjectURL(file);
                const trackName = file.name.replace(/\.mp3$/i, ''); // Убираем .mp3 из имени файла

                const track = {
                    title: trackName,
                    url: url
                };
                playlist.push(track);
            }
        }

        updatePlaylistUI(); // Обновляем интерфейс плейлиста

        // Если это первый трек, сразу воспроизводим его
        if (playlist.length > 0) {
            playRandomTrack();
        }
    });

    // Обновление интерфейса плейлиста
    function updatePlaylistUI() {
        playlistElement.innerHTML = ''; // Очищаем плейлист
        playlist.forEach((track, index) => {
            const li = document.createElement('li');
            li.textContent = track.title; // Отображаем название трека без расширения

            const removeButton = document.createElement('button');
            removeButton.textContent = 'Удалить';
            removeButton.className = 'remove-button';
            removeButton.addEventListener('click', () => {
                playlist.splice(index, 1); // Удаляем трек из массива
                updatePlaylistUI(); // Обновляем отображение плейлиста
            });

            li.appendChild(removeButton); // Добавляем кнопку удаления к элементу списка
            li.addEventListener('click', () => {
                playTrack(index);
            });
            playlistElement.appendChild(li);
        });
    }

    // Функция для воспроизведения случайного трека
    function playRandomTrack() {
        if (playlist.length > 0) {
            const randomIndex = Math.floor(Math.random() * playlist.length);
            playTrack(randomIndex);
        }
    }

    // Функция для воспроизведения трека
    function playTrack(index) {
        audioSource.src = playlist[index].url;
        audioPlayer.load();
        audioPlayer.play();
    }

    // Обработка клика по кнопке воспроизведения/паузы
    playPauseButton.addEventListener('click', function() {
        if (audioPlayer.paused) {
            audioPlayer.play();
            playPauseIcon.src = 'file:///C:/Users/User/Desktop/RIPOUND/image/buttons/pause.png'; // Путь к изображению паузы
        } else {
            audioPlayer.pause();
            playPauseIcon.src = 'file:///C:/Users/User/Desktop/RIPOUND/image/buttons/play.png'; // Путь к изображению воспроизведения
        }
    });

    // Обновление бегунка времени во время воспроизведения
    audioPlayer.addEventListener('timeupdate', function() {
        timeSlider.max = audioPlayer.duration; // Устанавливаем максимальное значение бегунка
        timeSlider.value = audioPlayer.currentTime; // Устанавливаем текущее значение бегунка

        // Обновляем текущее время и максимальное время
        currentTimeDisplay.textContent = formatTime(audioPlayer.currentTime);
        durationTimeDisplay.textContent = formatTime(audioPlayer.duration);
    });

    // Обработка изменения времени через бегунок
    timeSlider.addEventListener('input', function() {
        audioPlayer.currentTime = this.value; // Устанавливаем текущее время воспроизведения
    });

    // Воспроизведение следующего трека по окончании текущего
    audioPlayer.addEventListener('ended', () => {
        playRandomTrack(); // Воспроизводим случайный трек по окончании
    });

    // Функция для форматирования времени в формате MM:SS
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }
});
