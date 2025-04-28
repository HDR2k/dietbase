// Czekamy na załadowanie całego dokumentu
document.addEventListener('DOMContentLoaded', function() {
    // Obsługa przycisku "Rozpocznij teraz"
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', function() {
            // Przekierowanie do strony rejestracji
            window.location.href = '#register';
        });
    }

    // Płynne przewijanie do sekcji
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Animacja kart funkcji przy przewijaniu
    const featureCards = document.querySelectorAll('.feature-card');
    
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    featureCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(card);
    });

    // Obsługa formularza logowania
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            // TODO: Dodać właściwą obsługę logowania
            console.log('Próba logowania:', { email, password });
            alert('Funkcja logowania zostanie zaimplementowana wkrótce!');
        });
    }

    // Obsługa sekcji preferencji pacjenta
    const registerType = document.getElementById('registerType');
    const patientPreferences = document.getElementById('patientPreferences');

    if (registerType && patientPreferences) {
        registerType.addEventListener('change', function() {
            patientPreferences.style.display = 
                this.value === 'patient' ? 'block' : 'none';
        });
    }

    // Obsługa tagów alergii
    const allergiesInput = document.getElementById('allergies');
    const tagsContainer = document.querySelector('.tags-container');

    if (allergiesInput && tagsContainer) {
        allergiesInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && this.value.trim()) {
                e.preventDefault();
                addTag(this.value.trim());
                this.value = '';
            }
        });
    }

    function addTag(text) {
        const tag = document.createElement('div');
        tag.className = 'tag';
        tag.innerHTML = `
            ${text}
            <button type="button" onclick="this.parentElement.remove()">&times;</button>
        `;
        tagsContainer.appendChild(tag);
    }

    // Obsługa formularza rejestracji z preferencjami
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Zbieranie danych z formularza
            const formData = {
                name: document.getElementById('registerName').value,
                email: document.getElementById('registerEmail').value,
                password: document.getElementById('registerPassword').value,
                type: document.getElementById('registerType').value
            };

            // Jeśli to pacjent, dodaj preferencje
            if (formData.type === 'patient') {
                formData.preferences = {
                    preferredMeals: Array.from(document.querySelectorAll('input[name="preferredMeals"]:checked'))
                        .map(cb => cb.value),
                    dietaryRestrictions: Array.from(document.querySelectorAll('input[name="dietaryRestrictions"]:checked'))
                        .map(cb => cb.value),
                    conditions: Array.from(document.querySelectorAll('input[name="conditions"]:checked'))
                        .map(cb => cb.value),
                    allergies: Array.from(document.querySelectorAll('.tag'))
                        .map(tag => tag.textContent.trim()),
                    additionalNotes: document.getElementById('additionalNotes').value
                };
            }

            // TODO: Dodać właściwą obsługę rejestracji
            console.log('Dane rejestracji:', formData);
            alert('Funkcja rejestracji zostanie zaimplementowana wkrótce!');
        });
    }

    // Płynne przewijanie do sekcji logowania/rejestracji
    document.querySelectorAll('.auth-switch a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Obsługa drag and drop dla planera posiłków
    const mealItems = document.querySelectorAll('.meal-item');
    const mealSlots = document.querySelectorAll('.meal-slot');

    mealItems.forEach(item => {
        item.addEventListener('dragstart', function(e) {
            e.dataTransfer.setData('text/plain', this.dataset.mealId);
            this.classList.add('dragging');
        });

        item.addEventListener('dragend', function() {
            this.classList.remove('dragging');
        });
    });

    mealSlots.forEach(slot => {
        slot.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.classList.add('drag-over');
        });

        slot.addEventListener('dragleave', function() {
            this.classList.remove('drag-over');
        });

        slot.addEventListener('drop', function(e) {
            e.preventDefault();
            this.classList.remove('drag-over');
            
            const mealId = e.dataTransfer.getData('text/plain');
            const mealItem = document.querySelector(`[data-meal-id="${mealId}"]`);
            
            if (mealItem) {
                // Tworzymy kopię posiłku
                const mealCopy = mealItem.cloneNode(true);
                mealCopy.classList.add('dropped-meal');
                
                // Czyścimy slot i dodajemy nowy posiłek
                this.innerHTML = '';
                this.appendChild(mealCopy);
                this.classList.add('has-meal');
                
                // Dodajemy przycisk usuwania
                const removeButton = document.createElement('button');
                removeButton.className = 'remove-meal';
                removeButton.innerHTML = '×';
                removeButton.onclick = function() {
                    slot.innerHTML = '';
                    slot.classList.remove('has-meal');
                };
                mealCopy.appendChild(removeButton);
            }
        });
    });

    // Obsługa filtrowania posiłków
    initFilters();

    // Funkcja do aktualizacji ikon czasu
    updateTimeIcons();

    // Obsługa kalkulatora BMI
    initBMICalculator();
    initBMRCalculator();

    // Obsługa bazy posiłków
    initMealDatabase();

    // Inicjalizacja tabeli jadłospisu
    initMealSchedule();
});

// Obsługa filtrowania posiłków
function initFilters() {
    const filterCheckboxes = document.querySelectorAll('.filter-checkbox input');
    const mealItems = document.querySelectorAll('.meal-item');

    filterCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateFilters);
    });

    function updateFilters() {
        const activeFilters = {
            dietary: [],
            restrictions: [],
            time: []
        };

        // Zbierz aktywne filtry
        filterCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                const filterType = checkbox.getAttribute('data-filter');
                if (filterType.includes('free')) {
                    activeFilters.dietary.push(filterType);
                } else if (['2plus', '3plus', '4plus'].includes(filterType)) {
                    activeFilters.restrictions.push(filterType);
                } else {
                    activeFilters.time.push(filterType);
                }
            }
        });

        // Filtruj posiłki
        mealItems.forEach(meal => {
            const restrictions = meal.getAttribute('data-restrictions');
            const time = parseInt(meal.getAttribute('data-time'));
            const dietary = meal.getAttribute('data-dietary')?.split(' ') || [];

            let isVisible = true;

            // Sprawdź ograniczenia dietetyczne
            if (activeFilters.dietary.length > 0) {
                isVisible = activeFilters.dietary.every(filter => 
                    dietary.includes(filter));
            }

            // Sprawdź liczbę chorób/alergii
            if (isVisible && activeFilters.restrictions.length > 0) {
                isVisible = activeFilters.restrictions.some(filter => {
                    if (filter === '2plus') return restrictions === '2plus';
                    if (filter === '3plus') return ['3plus', '4plus'].includes(restrictions);
                    if (filter === '4plus') return restrictions === '4plus';
                    return false;
                });
            }

            // Sprawdź czas przygotowania
            if (isVisible && activeFilters.time.length > 0) {
                isVisible = activeFilters.time.some(filter => {
                    if (filter === 'quick') return time <= 5;
                    if (filter === 'medium') return time > 5 && time <= 30;
                    if (filter === 'long') return time > 30;
                    return false;
                });
            }

            // Pokaż lub ukryj posiłek
            meal.style.display = isVisible ? 'block' : 'none';
        });
    }
}

// Funkcja do aktualizacji ikon czasu
function updateTimeIcons() {
    const mealItems = document.querySelectorAll('.meal-item');
    
    mealItems.forEach(meal => {
        const time = parseInt(meal.getAttribute('data-time'));
        const timeIcon = meal.querySelector('.time-icon');
        
        if (timeIcon) {
            if (time <= 5) {
                timeIcon.setAttribute('data-time', 'quick');
            } else if (time <= 30) {
                timeIcon.setAttribute('data-time', 'medium');
            } else {
                timeIcon.setAttribute('data-time', 'long');
            }
        }
    });
}

// Obsługa kalkulatora BMI
function initBMICalculator() {
    const bmiForm = document.getElementById('bmiForm');
    const bmiResultContainer = document.getElementById('bmiResult');
    const resultText = bmiResultContainer.querySelector('.result-text');
    const resultValueElement = bmiResultContainer.querySelector('.value');

    if (bmiForm) {
        bmiForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const weight = parseFloat(document.getElementById('bmiWeight').value);
            const height = parseFloat(document.getElementById('bmiHeight').value) / 100; // konwersja na metry

            // Prosta walidacja
            if (isNaN(weight) || weight <= 0 || isNaN(height) || height <= 0) {
                alert('Proszę podać prawidłową wagę i wzrost.');
                bmiResultContainer.classList.remove('visible');
                return;
            }
            
            const bmi = weight / (height * height);
            
            // Aktualizacja wartości liczbowej BMI
            resultValueElement.textContent = bmi.toFixed(1);

            // Ustalenie kategorii i aktualizacja tekstu wyniku
            let category = '';
            let textColor = '';

            if (bmi < 18.5) {
                category = 'Niedowaga';
                textColor = '#3498db';
            } else if (bmi < 25) {
                category = 'Prawidłowa waga';
                textColor = 'var(--accent-green)';
            } else if (bmi < 30) {
                category = 'Nadwaga';
                textColor = '#f1c40f';
            } else {
                category = 'Otyłość';
                textColor = '#e74c3c';
            }

            resultText.textContent = category;
            resultText.style.color = textColor;

            // Pokazanie kontenera z wynikami
            bmiResultContainer.classList.add('visible');
        });
    }
}

// Obsługa kalkulatora BMR
function initBMRCalculator() {
    const bmrForm = document.getElementById('bmrForm');
    const bmrResult = document.getElementById('bmrResult');
    
    // Ukryj sekcję wyników na początku
    if (bmrResult) {
        bmrResult.style.display = 'none';
    }

    if (bmrForm) {
        bmrForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const gender = document.getElementById('bmrGender').value;
            const age = parseInt(document.getElementById('bmrAge').value);
            const weight = parseFloat(document.getElementById('bmrWeight').value);
            const height = parseFloat(document.getElementById('bmrHeight').value);
            const activity = parseFloat(document.getElementById('bmrActivity').value);

            // Prosta walidacja
            if (isNaN(age) || age <= 0 || isNaN(weight) || weight <= 0 || 
                isNaN(height) || height <= 0 || isNaN(activity) || activity <= 0) {
                alert('Proszę podać prawidłowe wartości.');
                return;
            }

            // Obliczanie BMR (wzór Mifflina-St Jeora)
            let bmr;
            if (gender === 'male') {
                bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
            } else {
                bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
            }

            // Obliczanie dziennego zapotrzebowania
            const tdee = bmr * activity;

            // Aktualizacja wyników
            const bmrValue = bmrResult.querySelectorAll('.result-value .value')[0];
            const tdeeValue = bmrResult.querySelectorAll('.result-value .value')[1];
            bmrValue.textContent = Math.round(bmr);
            tdeeValue.textContent = Math.round(tdee);

            // Aktualizacja celu kalorycznego
            const goalValue = bmrResult.querySelector('.goal-value');
            const goalDescription = bmrResult.querySelector('.goal-description');
            
            // Domyślnie pokazujemy wartość utrzymania wagi
            goalValue.textContent = Math.round(tdee) + ' kcal';
            goalDescription.textContent = 'Utrzymanie wagi';
            
            // Pokaż sekcję wyników
            bmrResult.style.display = 'block';
            
            // Dodaj obsługę wyboru celu
            const goalSelect = document.getElementById('bmrGoal');
            if (goalSelect) {
                goalSelect.addEventListener('change', function() {
                    const goal = this.value;
                    if (goal === 'reduction') {
                        goalValue.textContent = Math.round(tdee * 0.8) + ' kcal';
                        goalDescription.textContent = 'Redukcja wagi';
                    } else if (goal === 'maintenance') {
                        goalValue.textContent = Math.round(tdee) + ' kcal';
                        goalDescription.textContent = 'Utrzymanie wagi';
                    } else if (goal === 'bulk') {
                        goalValue.textContent = Math.round(tdee * 1.2) + ' kcal';
                        goalDescription.textContent = 'Budowa masy mięśniowej';
                    }
                });
            }
        });
    }
}

// Obsługa bazy posiłków
function initMealDatabase() {
    const filterButtons = document.querySelectorAll('.filter-button');
    const mealCards = document.querySelectorAll('.database-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Usuń klasę active ze wszystkich przycisków
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Dodaj klasę active do klikniętego przycisku
            button.classList.add('active');

            const category = button.dataset.category;

            mealCards.forEach(card => {
                if (category === 'all' || card.dataset.category === category) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// Funkcja do obliczania sum wartości odżywczych dla danego dnia
function calculateNutritionTotals(day) {
    const slots = document.querySelectorAll(`.meal-slot[data-day="${day}"]`);
    let totals = {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0
    };

    slots.forEach(slot => {
        const meal = slot.querySelector('.dropped-meal');
        if (meal) {
            const calories = parseInt(meal.querySelector('.meal-calories').textContent);
            const macros = meal.querySelectorAll('.macros span');
            
            totals.calories += calories;
            totals.protein += parseInt(macros[0].textContent.match(/\d+/)[0]);
            totals.carbs += parseInt(macros[1].textContent.match(/\d+/)[0]);
            totals.fat += parseInt(macros[2].textContent.match(/\d+/)[0]);
        }
    });

    return totals;
}

// Funkcja do aktualizacji podsumowania dla danego dnia
function updateDayTotals(day) {
    const totals = calculateNutritionTotals(day);
    const totalRow = document.querySelector(`.day-totals[data-day="${day}"]`);
    
    if (totalRow) {
        totalRow.innerHTML = `
            <div class="nutrition-totals">
                <div>Kalorie: ${totals.calories} kcal</div>
                <div>B: ${totals.protein}g</div>
                <div>W: ${totals.carbs}g</div>
                <div>T: ${totals.fat}g</div>
            </div>
        `;
    }
}

// Obsługa tabeli jadłospisu
function initMealSchedule() {
    const mealsPerDaySelect = document.getElementById('mealsPerDay');
    const scheduleBody = document.getElementById('scheduleBody');
    
    // Funkcja do generowania wierszy tabeli
    function generateScheduleRows() {
        const mealsPerDay = parseInt(mealsPerDaySelect.value);
        const mealTypes = [
            { id: 'breakfast', name: 'Śniadanie' },
            { id: 'lunch', name: 'Obiad' },
            { id: 'dinner', name: 'Kolacja' },
            { id: 'snack1', name: 'Przekąska 1' },
            { id: 'snack2', name: 'Przekąska 2' },
            { id: 'snack3', name: 'Przekąska 3' }
        ];
        
        // Wyczyść tabelę
        scheduleBody.innerHTML = '';
        
        // Generuj wiersze dla każdego posiłku
        for (let i = 0; i < mealsPerDay; i++) {
            const row = document.createElement('tr');
            
            // Dodaj komórki dla każdego dnia tygodnia
            for (let day = 1; day <= 7; day++) {
                const cell = document.createElement('td');
                cell.className = 'meal-slot';
                cell.setAttribute('data-day', day);
                cell.setAttribute('data-meal', mealTypes[i].id);
                
                // Dodaj etykietę posiłku
                const mealLabel = document.createElement('div');
                mealLabel.className = 'meal-label';
                mealLabel.textContent = mealTypes[i].name;
                cell.appendChild(mealLabel);
                
                row.appendChild(cell);
            }
            
            scheduleBody.appendChild(row);
        }

        // Dodaj wiersz podsumowania dla każdego dnia
        const totalsRow = document.createElement('tr');
        totalsRow.className = 'totals-row';
        
        for (let day = 1; day <= 7; day++) {
            const cell = document.createElement('td');
            cell.className = 'day-totals';
            cell.setAttribute('data-day', day);
            cell.innerHTML = `
                <div class="nutrition-totals">
                    <div>Kalorie: 0 kcal</div>
                    <div>B: 0g</div>
                    <div>W: 0g</div>
                    <div>T: 0g</div>
                </div>
            `;
            totalsRow.appendChild(cell);
        }
        
        scheduleBody.appendChild(totalsRow);
        
        // Inicjalizuj obsługę przeciągania dla nowych komórek
        initDragAndDrop();
    }
    
    // Nasłuchuj zmian w liczbie posiłków
    if (mealsPerDaySelect) {
        mealsPerDaySelect.addEventListener('change', generateScheduleRows);
        
        // Generuj wiersze przy pierwszym załadowaniu
        generateScheduleRows();
    }
}

// Inicjalizacja obsługi przeciągania
function initDragAndDrop() {
    const mealItems = document.querySelectorAll('.meal-item');
    const mealSlots = document.querySelectorAll('.meal-slot');
    
    mealItems.forEach(item => {
        item.setAttribute('draggable', 'true');
        
        item.addEventListener('dragstart', function(e) {
            e.dataTransfer.setData('text/plain', this.dataset.mealId);
            this.classList.add('dragging');
        });
        
        item.addEventListener('dragend', function() {
            this.classList.remove('dragging');
        });
    });
    
    mealSlots.forEach(slot => {
        slot.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.classList.add('drag-over');
        });
        
        slot.addEventListener('dragleave', function() {
            this.classList.remove('drag-over');
        });
        
        slot.addEventListener('drop', function(e) {
            e.preventDefault();
            this.classList.remove('drag-over');
            
            const mealId = e.dataTransfer.getData('text/plain');
            const mealItem = document.querySelector(`[data-meal-id="${mealId}"]`);
            
            if (mealItem) {
                const mealCopy = mealItem.cloneNode(true);
                mealCopy.classList.add('dropped-meal');
                
                const mealLabel = this.querySelector('.meal-label');
                
                this.innerHTML = '';
                if (mealLabel) {
                    this.appendChild(mealLabel);
                }
                this.appendChild(mealCopy);
                this.classList.add('has-meal');
                
                const removeButton = document.createElement('button');
                removeButton.className = 'remove-meal';
                removeButton.innerHTML = '×';
                removeButton.onclick = function() {
                    const label = slot.querySelector('.meal-label');
                    slot.innerHTML = '';
                    if (label) {
                        slot.appendChild(label);
                    }
                    slot.classList.remove('has-meal');
                    // Aktualizuj sumy po usunięciu posiłku
                    updateDayTotals(slot.getAttribute('data-day'));
                };
                mealCopy.appendChild(removeButton);

                // Aktualizuj sumy po dodaniu posiłku
                updateDayTotals(slot.getAttribute('data-day'));
            }
        });
    });
} 