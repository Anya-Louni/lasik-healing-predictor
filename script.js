document.addEventListener('DOMContentLoaded', function() {
    // Initialize the constellation background
    initConstellationBackground();
    
    // Set up form navigation
    setupFormNavigation();
    
    // Set up range input displays
    setupRangeInputs();
});

// Constellation Background Animation
function initConstellationBackground() {
    const canvas = document.getElementById('constellation');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let connections = [];
    
    // Set canvas dimensions
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Create particles
    function createParticles() {
        const particleCount = Math.floor(window.innerWidth * window.innerHeight / 15000);
        particles = [];
        
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 1.5 + 0.5,
                vx: Math.random() * 0.2 - 0.1,
                vy: Math.random() * 0.2 - 0.1,
                connections: 0
            });
        }
    }
    
    // Find connections between particles
    function findConnections() {
        connections = [];
        const maxDistance = Math.min(canvas.width, canvas.height) / 8;
        
        for (let i = 0; i < particles.length; i++) {
            particles[i].connections = 0;
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < maxDistance) {
                    connections.push({
                        from: i,
                        to: j,
                        distance: distance,
                        opacity: 1 - (distance / maxDistance)
                    });
                    
                    particles[i].connections++;
                    particles[j].connections++;
                }
            }
        }
    }
    
    // Draw the constellation
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw connections
        ctx.lineWidth = 0.5;
        for (let i = 0; i < connections.length; i++) {
            const connection = connections[i];
            const from = particles[connection.from];
            const to = particles[connection.to];
            
            ctx.strokeStyle = `rgba(135, 206, 250, ${connection.opacity * 0.5})`;
            ctx.beginPath();
            ctx.moveTo(from.x, from.y);
            ctx.lineTo(to.x, to.y);
            ctx.stroke();
        }
        
        // Draw particles
        for (let i = 0; i < particles.length; i++) {
            const particle = particles[i];
            
            ctx.fillStyle = particle.connections > 0 
                ? `rgba(255, 255, 255, ${0.3 + (particle.connections * 0.05)})`
                : 'rgba(226, 237, 245, 0.3)';
                
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            ctx.fill();
            
            // Move particles
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Bounce off edges
            if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
        }
        
        // Find new connections periodically
        if (Math.random() < 0.03) {
            findConnections();
        }
        
        requestAnimationFrame(draw);
    }
    
    // Handle window resize
    window.addEventListener('resize', function() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        createParticles();
        findConnections();
    });
    
    // Initialize
    createParticles();
    findConnections();
    draw();
}

// Form Navigation Setup
function setupFormNavigation() {
    // Welcome page to form
    document.getElementById('start-btn').addEventListener('click', function() {
        showPage('prediction-form');
        updateProgress(1);
    });
    
    // Back to welcome
    document.getElementById('back-to-welcome').addEventListener('click', function() {
        showPage('welcome-page');
    });
    
    // Page 1 to Page 2
    document.getElementById('next-to-page-2').addEventListener('click', function() {
        // Validate inputs
        if (validateFormPage(1)) {
            showFormPage(2);
            updateProgress(2);
        }
    });
    
    // Page 2 to Page 1
    document.getElementById('back-to-page-1').addEventListener('click', function() {
        showFormPage(1);
        updateProgress(1);
    });
    
    // Page 2 to Page 3
    document.getElementById('next-to-page-3').addEventListener('click', function() {
        // Validate inputs
        if (validateFormPage(2)) {
            showFormPage(3);
            updateProgress(3);
        }
    });
    
    // Page 3 to Page 2
    document.getElementById('back-to-page-2').addEventListener('click', function() {
        showFormPage(2);
        updateProgress(2);
    });
    
    // Calculate prediction
    document.getElementById('calculate-btn').addEventListener('click', function() {
        if (validateFormPage(3)) {
            // Show loading state
            document.getElementById('loading-overlay').classList.add('active');
            calculatePrediction();
        }
    });
    
    // Back to form from results
    document.getElementById('back-to-form').addEventListener('click', function() {
        showPage('prediction-form');
    });
    
    // Download report button
    document.getElementById('download-report').addEventListener('click', function() {
        alert('Report generation feature will be available soon.');
    });
}

// Setup range input displays
function setupRangeInputs() {
    // Dry eye score
    const dryEyeInput = document.getElementById('dry_eye_score');
    const dryEyeValue = document.getElementById('dry_eye_value');
    
    dryEyeInput.addEventListener('input', function() {
        dryEyeValue.textContent = this.value;
    });
    
    // Med compliance
    const medComplianceInput = document.getElementById('post_op_med_compliance');
    const medComplianceValue = document.getElementById('med_compliance_value');
    
    medComplianceInput.addEventListener('input', function() {
        medComplianceValue.textContent = this.value;
    });
}

// Show a specific page
function showPage(pageId) {
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.remove('active');
    });
    
    // Show the selected page
    document.getElementById(pageId).classList.add('active');
    
    // Scroll to top
    window.scrollTo(0, 0);
}

// Show a specific form page
function showFormPage(pageNumber) {
    // Hide all form pages
    const formPages = document.querySelectorAll('.form-page');
    formPages.forEach(page => {
        page.classList.remove('active');
    });
    
    // Show the selected form page
    document.getElementById(`form-page-${pageNumber}`).classList.add('active');
}

// Update progress bar and steps
function updateProgress(step) {
    // Update progress bar
    const progressBar = document.getElementById('form-progress');
    progressBar.style.width = `${(step / 3) * 100}%`;
    
    // Update steps
    const steps = document.querySelectorAll('.step');
    steps.forEach((stepEl, index) => {
        if (index + 1 < step) {
            stepEl.classList.add('completed');
            stepEl.classList.remove('active');
        } else if (index + 1 === step) {
            stepEl.classList.add('active');
            stepEl.classList.remove('completed');
        } else {
            stepEl.classList.remove('active', 'completed');
        }
    });
}

// Validate form page inputs
function validateFormPage(pageNumber) {
    let isValid = true;
    let inputsToValidate = [];
    
    switch(pageNumber) {
        case 1:
            inputsToValidate = ['age', 'gender', 'pre_op_vision'];
            break;
        case 2:
            inputsToValidate = ['corneal_thickness', 'pupil_size'];
            // Range inputs are always valid
            break;
        case 3:
            inputsToValidate = ['contact_lens_history', 'surgery_type'];
            // Range inputs are always valid
            break;
    }
    
    inputsToValidate.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (!input.value) {
            input.style.borderColor = '#e74c3c';
            isValid = false;
        } else {
            input.style.borderColor = '#ddd';
        }
    });
    
    if (!isValid) {
        // Add shake animation to the form
        const formPage = document.getElementById(`form-page-${pageNumber}`);
        formPage.classList.add('shake');
        setTimeout(() => {
            formPage.classList.remove('shake');
        }, 500);
    }
    
    return isValid;
}

// Calculate prediction based on form inputs
async function calculatePrediction() {
    // Get all form values
    const age = parseInt(document.getElementById('age').value);
    const gender = document.getElementById('gender').value;
    const preOpVision = parseFloat(document.getElementById('pre_op_vision').value);
    const cornealThickness = parseInt(document.getElementById('corneal_thickness').value);
    const pupilSize = parseFloat(document.getElementById('pupil_size').value);
    const dryEyeScore = parseInt(document.getElementById('dry_eye_score').value);
    const contactLensHistory = parseInt(document.getElementById('contact_lens_history').value);
    const surgeryType = document.getElementById('surgery_type').value;
    const medCompliance = parseInt(document.getElementById('post_op_med_compliance').value);
    
    // Prepare data for API call
    const requestData = {
        age: age,
        gender: gender,
        pre_op_vision: preOpVision,
        corneal_thickness: cornealThickness,
        pupil_size: pupilSize,
        dry_eye_score: dryEyeScore,
        contact_lens_history: contactLensHistory,
        surgery_type: surgeryType,
        post_op_med_compliance: medCompliance
    };
    
    try {
        // Make API call to Flask backend
        const response = await fetch('/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const result = await response.json();
        
        // Use the prediction result
        const predictionScore = result.probability;
        
        // Show results page and hide loading overlay
        document.getElementById('loading-overlay').classList.remove('active');
        showPage('results-page');
        
        // Animate results
        animateResults(predictionScore);
        
        // Generate recommendations
        generateRecommendations(predictionScore, {
            age: age,
            dryEyeScore: dryEyeScore,
            medCompliance: medCompliance,
            contactHistory: contactLensHistory
        });
        
    } catch (error) {
        console.error('Error calling prediction API:', error);
        document.getElementById('loading-overlay').classList.remove('active');
        
        // Fallback to client-side prediction if API fails
        console.log('Falling back to client-side prediction');
        fallbackPrediction(age, gender, preOpVision, cornealThickness, pupilSize, 
                         dryEyeScore, contactLensHistory, surgeryType, medCompliance);
    }
}

// Fallback prediction method (original client-side calculation)
function fallbackPrediction(age, gender, preOpVision, cornealThickness, pupilSize, 
                         dryEyeScore, contactLensHistory, surgeryType, medCompliance) {
    // Calculate prediction score (simplified model)
    // Age factor (younger generally heals better)
    const ageFactor = Math.max(0, 100 - (age - 20) * 1.5) / 100;
    
    // Corneal thickness factor (thicker is better)
    const thicknessFactor = Math.min(1, cornealThickness / 550);
    
    // Dry eye factor (lower is better)
    const dryEyeFactor = (10 - dryEyeScore) / 10;
    
    // Pupil size factor (moderate is optimal)
    const pupilFactor = 1 - Math.abs(pupilSize - 5) / 3;
    
    // Contact lens history factor (less is better)
    const contactFactor = Math.max(0, 1 - contactLensHistory / 20);
    
    // Medication compliance factor
    const complianceFactor = medCompliance / 10;
    
    // Surgery type factor
    let surgeryFactor = 0.85; // Default - LASIK
    if (surgeryType === 'PRK') surgeryFactor = 0.8;
    if (surgeryType === 'SMILE') surgeryFactor = 0.9;
    if (surgeryType === 'LASEK') surgeryFactor = 0.82;
    
    // Gender factor (minor difference)
    const genderFactor = gender === 'female' ? 1.02 : 1.0;
    
    // Vision severity (moderate correction has best outcomes)
    const visionFactor = 1 - Math.abs(preOpVision + 3) / 10;
    
    // Calculate overall prediction (weighted average)
    let predictionScore = (
        ageFactor * 0.15 +
        thicknessFactor * 0.15 +
        dryEyeFactor * 0.15 +
        pupilFactor * 0.1 +
        contactFactor * 0.1 +
        complianceFactor * 0.15 +
        surgeryFactor * 0.1 +
        genderFactor * 0.05 +
        visionFactor * 0.05
    ) * 100;
    
    // Ensure score is between 0-100
    predictionScore = Math.min(98, Math.max(50, predictionScore));
    
    // Show results
    showPage('results-page');
    
    // Animate results
    animateResults(predictionScore);
    
    // Generate recommendations
    generateRecommendations(predictionScore, {
        age: age,
        dryEyeScore: dryEyeScore,
        medCompliance: medCompliance,
        contactHistory: contactLensHistory
    });
}

// Animate results display
function animateResults(score) {
    // Animate gauge
    const gaugeText = document.querySelector('.gauge-text');
    const gaugeFill = document.querySelector('.gauge-fill');
    const circumference = 2 * Math.PI * 80;
    
    // Start from 0 and animate to actual score
    let currentValue = 0;
    const duration = 2000; // 2 seconds
    const startTime = performance.now();
    
    function updateGauge(timestamp) {
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        currentValue = Math.floor(progress * score);
        gaugeText.textContent = `${currentValue}%`;
        
        // Calculate stroke dash offset
        const dashOffset = circumference - (circumference * currentValue / 100);
        gaugeFill.style.strokeDasharray = circumference;
        gaugeFill.style.strokeDashoffset = dashOffset;
        
        if (progress < 1) {
            requestAnimationFrame(updateGauge);
        }
    }
    
    requestAnimationFrame(updateGauge);
    
    // Set color based on score
    let color;
    if (score >= 80) color = '#2ecc71'; // Green
    else if (score >= 70) color = '#3498db'; // Blue
    else if (score >= 60) color = '#f39c12'; // Orange
    else color = '#e74c3c'; // Red
    
    gaugeFill.style.stroke = color;
    
    // Animate factor bars
    setTimeout(() => {
        // Recovery time
        const recoveryBar = document.getElementById('recovery-time-bar');
        recoveryBar.style.width = `${score * 0.9 + Math.random() * 10}%`;
        recoveryBar.style.backgroundColor = color;
        
        // Vision stability
        const stabilityBar = document.getElementById('stability-bar');
        stabilityBar.style.width = `${score * 0.85 + Math.random() * 15}%`;
        stabilityBar.style.backgroundColor = color;
        
        // Complication risk (inverse - higher score means lower risk)
        const complicationBar = document.getElementById('complication-bar');
        complicationBar.style.width = `${100 - (100 - score) * 1.2}%`;
        complicationBar.style.backgroundColor = score < 70 ? '#e74c3c' : color;
    }, 500);
}

// Generate personalized recommendations
function generateRecommendations(score, factors) {
    const recommendationsDiv = document.getElementById('recommendations-content');
    let recommendations = [];
    
    // General recommendation based on score
    if (score >= 80) {
        recommendations.push("Your prediction suggests excellent healing potential. You appear to be an ideal candidate for LASIK surgery.");
    } else if (score >= 70) {
        recommendations.push("Your prediction suggests good healing potential. Most factors indicate you would be a suitable candidate for LASIK surgery.");
    } else if (score >= 60) {
        recommendations.push("Your prediction suggests moderate healing potential. Consider discussing alternative procedures with your ophthalmologist.");
    } else {
        recommendations.push("Your prediction suggests some concerns with healing potential. We strongly recommend discussing these results with your ophthalmologist.");
    }
    
    // Age-specific recommendations
    if (factors.age > 50) {
        recommendations.push("Given your age, be sure to discuss presbyopia (age-related farsightedness) with your doctor, as LASIK may not correct this condition.");
    }
    
    // Dry eye recommendations
    if (factors.dryEyeScore > 5) {
        recommendations.push("Your dry eye score indicates potential issues. Consider pre-treatment with lubricating eye drops and omega-3 supplements before surgery.");
    }
    
    // Compliance recommendations
    if (factors.medCompliance < 8) {
        recommendations.push("Strict adherence to post-operative medication schedules is crucial for optimal healing. Consider setting reminders to ensure compliance.");
    }
    
    // Contact lens history recommendations
    if (factors.contactHistory > 10) {
        recommendations.push("Long-term contact lens wear may affect corneal health. Discontinue contact lens use at least 2-4 weeks before your evaluation and surgery.");
    }
    
    // Display recommendations
    recommendationsDiv.innerHTML = recommendations.map(rec => `<p>• ${rec}</p>`).join('');
}

// Add shake animation
document.head.insertAdjacentHTML('beforeend', `
    <style>
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            20%, 60% { transform: translateX(-5px); }
            40%, 80% { transform: translateX(5px); }
        }
        .shake {
            animation: shake 0.5s ease;
        }
        
        /* Loading overlay */
        #loading-overlay {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.7);
            z-index: 9999;
            justify-content: center;
            align-items: center;
            flex-direction: column;
        }
        
        #loading-overlay.active {
            display: flex;
        }
        
        .spinner {
            border: 5px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            border-top: 5px solid #3498db;
            width: 50px;
            height: 50px;
            animation: spin 1s linear infinite;
            margin-bottom: 20px;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .loading-text {
            color: white;
            font-size: 18px;
            font-weight: 600;
        }
    </style>
`);

// Add loading overlay to the DOM
document.body.insertAdjacentHTML('beforeend', `
    <div id="loading-overlay">
        <div class="spinner"></div>
        <div class="loading-text">Processing your data...</div>
    </div>
`);