// DOM Elements
const appContainer = document.querySelector('.app-container');
const sidebar = document.querySelector('.sidebar');
const mainContent = document.querySelector('.main-content');
const navLinks = document.querySelectorAll('nav ul li');
const sections = document.querySelectorAll('.section');
const askAiBtn = document.getElementById('ask-ai-btn');
const viewTipsBtn = document.getElementById('view-tips-btn');
const chatbotToggle = document.getElementById('chatbot-toggle');

// Debug: Check if ChatAssistant is available
console.log('ChatAssistant available:', typeof ChatAssistant !== 'undefined');

// Navigation
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        // Remove active class from all links
        navLinks.forEach(l => l.classList.remove('active'));
        // Add active class to clicked link
        link.classList.add('active');
        
        // Hide all sections
        sections.forEach(section => section.classList.remove('active'));
        // Show corresponding section
        const targetSection = document.querySelector(`.section.${link.dataset.section}`);
        targetSection.classList.add('active');
    });
});

// Initialize chatbot when the page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing components...');
    
    // Initialize chatbot
    if (typeof ChatAssistant !== 'undefined') {
        ChatAssistant.init();
        console.log('ChatAssistant initialized');
    } else {
        console.error('ChatAssistant is not defined');
    }
    
    // Add event listener for the ask AI button
    if (askAiBtn) {
        askAiBtn.addEventListener('click', () => {
            console.log('Ask AI button clicked');
            if (typeof ChatAssistant !== 'undefined') {
                ChatAssistant.toggleChat();
            }
        });
    }
    
    // Add event listener for the chatbot toggle button
    if (chatbotToggle) {
        chatbotToggle.addEventListener('click', () => {
            console.log('Chatbot toggle button clicked');
            if (typeof ChatAssistant !== 'undefined') {
                ChatAssistant.toggleChat();
            }
        });
    }
});

viewTipsBtn.addEventListener('click', () => {
    // Navigate to safety tips section
    navLinks.forEach(l => l.classList.remove('active'));
    document.querySelector('li[data-section="safety-tips"]').classList.add('active');
    
    sections.forEach(section => section.classList.remove('active'));
    document.querySelector('.section.safety-tips').classList.add('active');
});

// Safety Calculator Functions
const safetyCalculator = {
    calculateSafetyScore(hours, speed, weather, nightDriving) {
        let score = 100;
        
        // Adjust for driving hours
        if (hours > 8) score -= (hours - 8) * 5;
        
        // Adjust for speed
        if (speed > 65) score -= (speed - 65) * 2;
        
        // Adjust for weather conditions
        const weatherPenalties = {
            'clear': 0,
            'rain': 15,
            'snow': 25,
            'fog': 20
        };
        score -= weatherPenalties[weather] || 0;
        
        // Adjust for night driving
        if (nightDriving === 'yes') score -= 10;
        
        // Ensure score stays between 0 and 100
        return Math.max(0, Math.min(100, score));
    },
    
    getSafetyRecommendations(hours, speed, weather, nightDriving) {
        const recommendations = [];
        
        // Hours recommendations
        if (hours > 8) {
            recommendations.push({
                category: 'Driving Hours',
                tip: 'Consider taking breaks every 2 hours or splitting your driving time. Fatigue increases accident risk.',
                priority: 'high'
            });
        }
        
        // Speed recommendations
        if (speed > 65) {
            recommendations.push({
                category: 'Speed',
                tip: 'Higher speeds increase stopping distance and reduce reaction time. Consider reducing speed.',
                priority: 'medium'
            });
        }
        
        // Weather recommendations
        const weatherTips = {
            'rain': 'Reduce speed and increase following distance in rain. Use headlights and ensure wipers work properly.',
            'snow': 'Significantly reduce speed in snow. Use winter tires and maintain longer following distances.',
            'fog': 'Use low-beam headlights in fog. Reduce speed and use fog lights if available.'
        };
        if (weatherTips[weather]) {
            recommendations.push({
                category: 'Weather',
                tip: weatherTips[weather],
                priority: 'high'
            });
        }
        
        // Night driving recommendations
        if (nightDriving === 'yes') {
            recommendations.push({
                category: 'Night Driving',
                tip: 'Ensure all lights are working properly. Reduce speed and be extra vigilant for pedestrians and wildlife.',
                priority: 'medium'
            });
        }
        
        return recommendations;
    }
};

function getScoreClass(score) {
    if (score >= 80) return 'excellent';
    if (score >= 60) return 'good';
    if (score >= 40) return 'fair';
    return 'poor';
}

function getScoreMessage(score) {
    if (score >= 80) return 'Excellent driving conditions! Keep up the safe driving habits.';
    if (score >= 60) return 'Good driving conditions. Consider the recommendations for improvement.';
    if (score >= 40) return 'Fair driving conditions. Please review the recommendations carefully.';
    return 'Poor driving conditions. Strongly consider the recommendations for your safety.';
}

function displaySafetyResults(score, recommendations) {
    const scoreDisplay = document.getElementById('safety-score-display');
    const recommendationsDisplay = document.getElementById('safety-recommendations');
    
    // Display score
    scoreDisplay.innerHTML = `
        <div class="safety-score ${getScoreClass(score)}">
            <h3>Safety Score: ${score}%</h3>
            <p>${getScoreMessage(score)}</p>
        </div>
    `;
    
    // Display recommendations
    recommendationsDisplay.innerHTML = `
        <h4>Safety Recommendations:</h4>
        <ul class="recommendations-list">
            ${recommendations.map(rec => `
                <li class="priority-${rec.priority}">
                    <strong>${rec.category}:</strong> ${rec.tip}
                </li>
            `).join('')}
        </ul>
    `;
}

function performSafetyCalculation() {
    const hours = parseFloat(document.getElementById('driving-hours').value) || 0;
    const speed = parseFloat(document.getElementById('driving-speed').value) || 0;
    const weather = document.getElementById('weather-condition').value;
    const nightDriving = document.getElementById('night-driving').value;
    
    // Calculate safety score
    const score = safetyCalculator.calculateSafetyScore(hours, speed, weather, nightDriving);
    
    // Get recommendations
    const recommendations = safetyCalculator.getSafetyRecommendations(hours, speed, weather, nightDriving);
    
    // Display results
    displaySafetyResults(score, recommendations);
}

// Initialize calculator when the page loads
document.addEventListener('DOMContentLoaded', function() {
    const calculateBtn = document.getElementById('calculate-safety');
    if (calculateBtn) {
        calculateBtn.addEventListener('click', performSafetyCalculation);
    }
});

// Sidebar Toggle
const sidebarToggle = document.querySelector('.sidebar-toggle');

// Initialize sidebar state
if (window.innerWidth <= 992) {
    sidebar.classList.add('collapsed');
}

// Toggle sidebar
sidebarToggle.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
    if (window.innerWidth <= 992) {
        sidebar.classList.toggle('expanded');
    }
});

// Close sidebar when clicking outside on mobile
document.addEventListener('click', (e) => {
    if (window.innerWidth <= 992 && 
        !sidebar.contains(e.target) && 
        !e.target.classList.contains('sidebar-toggle') &&
        sidebar.classList.contains('expanded')) {
        sidebar.classList.remove('expanded');
    }
});

// Handle window resize
window.addEventListener('resize', () => {
    if (window.innerWidth > 992) {
        sidebar.classList.remove('expanded');
    } else if (!sidebar.classList.contains('expanded')) {
        sidebar.classList.add('collapsed');
    }
});

// Theme Toggle Functionality
const themeToggleBtn = document.getElementById('theme-toggle-btn');
const body = document.body;

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    body.classList.add(savedTheme);
}

themeToggleBtn.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    
    // Save theme preference
    const currentTheme = body.classList.contains('dark-mode') ? 'dark-mode' : '';
    localStorage.setItem('theme', currentTheme);
});

// Resource Details Modal
function showResourceDetails(resourceType) {
    if (resourceType === 'videos') {
        // Redirect to YouTube video
        window.open('https://youtu.be/fVl88Q5DJ2w?si=X9EO_H-z0nPCg8Zb', '_blank');
        return;
    }
    
    if (resourceType === 'route') {
        // Redirect to Google Maps
        window.open('https://www.google.co.in/maps/dir///@31.2475648,75.7039104,14z?entry=ttu&g_ep=EgoyMDI1MDQxNi4xIKXMDSoASAFQAw%3D%3D', '_blank');
        return;
    }
    
    const modal = document.getElementById('resource-details-modal');
    const title = document.getElementById('resource-details-title');
    const content = document.getElementById('resource-details-content');
    
    // Set content based on resource type
    switch(resourceType) {
        case 'emergency':
            title.textContent = 'Emergency Contacts';
            content.innerHTML = `
                <p>Important emergency numbers:</p>
                <ul>
                    <li>Roadside Assistance: 1-800-XXX-XXXX</li>
                    <li>Emergency Services: 911</li>
                    <li>Local Police: [Your Local Number]</li>
                    <li>Insurance Provider: [Your Provider Number]</li>
                </ul>
            `;
            break;
    }
    
    modal.style.display = 'block';
}

// Close modals when clicking the close button
document.querySelectorAll('.close-modal').forEach(button => {
    button.addEventListener('click', () => {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
    });
});

// Close modals when clicking outside
window.addEventListener('click', (event) => {
    document.querySelectorAll('.modal').forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
});

// Safety Statistics Graph
let safetyChart = null;

function initializeSafetyChart() {
    const ctx = document.getElementById('safetyChart').getContext('2d');
    
    // Sample data - you can replace this with real data
    const data = {
        labels: ['Speed Safety', 'Weather Safety', 'Driving Time', 'Road Safety', 'Driver Alertness'],
        datasets: [{
            label: 'Safety Score (out of 100)',
            data: [75, 60, 80, 70, 65],
            backgroundColor: [
                'rgba(255, 99, 132, 0.7)',
                'rgba(54, 162, 235, 0.7)',
                'rgba(255, 206, 86, 0.7)',
                'rgba(75, 192, 192, 0.7)',
                'rgba(153, 102, 255, 0.7)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)'
            ],
            borderWidth: 1
        }]
    };

    const config = {
        type: 'bar',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Safety Score (0-100)'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: 'Safety Analysis Breakdown',
                    font: {
                        size: 16
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.raw}% safety score`;
                        }
                    }
                }
            }
        }
    };

    safetyChart = new Chart(ctx, config);
}

function updateSafetyChart(data) {
    if (safetyChart) {
        safetyChart.data.datasets[0].data = data;
        safetyChart.update();
    }
}

// Initialize chart when the page loads
document.addEventListener('DOMContentLoaded', () => {
    initializeSafetyChart();
    
    // Update chart when safety is calculated
    document.getElementById('calculate-safety').addEventListener('click', () => {
        const hours = parseFloat(document.getElementById('driving-hours').value) || 0;
        const speed = parseFloat(document.getElementById('driving-speed').value) || 0;
        const weather = document.getElementById('weather-condition').value;
        const nightDriving = document.getElementById('night-driving').value;
        
        // Calculate safety factors with clearer explanations
        const speedFactor = Math.max(0, 100 - (speed - 65) * 2); // Lower score for higher speeds
        const weatherFactor = {
            'clear': 100,  // Perfect conditions
            'rain': 70,    // Reduced visibility
            'snow': 50,    // Dangerous conditions
            'fog': 60      // Limited visibility
        }[weather] || 100;
        const timeFactor = Math.max(0, 100 - (hours - 8) * 5); // Lower score for longer driving hours
        const distanceFactor = 80; // Base road safety factor
        const fatigueFactor = nightDriving === 'yes' ? 70 : 90; // Lower score for night driving
        
        updateSafetyChart([
            speedFactor,
            weatherFactor,
            timeFactor,
            distanceFactor,
            fatigueFactor
        ]);
    });
});