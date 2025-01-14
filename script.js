// Add event listener to click on the calendar icon
document.getElementById("dob-calendar-icon").addEventListener("click", function() {
    const dobCalendar = document.getElementById("dob-calendar");
    // Toggle the display of the calendar input
    dobCalendar.style.display = dobCalendar.style.display === "inline" ? "none" : "inline";
});

document.getElementById("current-calendar-icon").addEventListener("click", function() {
    const currentCalendar = document.getElementById("current-calendar");
    // Toggle the display of the calendar input
    currentCalendar.style.display = currentCalendar.style.display === "inline" ? "none" : "inline";
});

// Date picker change event handler
document.getElementById("dob-calendar").addEventListener("change", function() {
    const dobInput = document.getElementById("dob");
    dobInput.value = this.value.split("-").reverse().join("/"); // Convert YYYY-MM-DD to DD/MM/YYYY
});

document.getElementById("current-calendar").addEventListener("change", function() {
    const currentInput = document.getElementById("current-date");
    currentInput.value = this.value.split("-").reverse().join("/"); // Convert YYYY-MM-DD to DD/MM/YYYY
});

// Event handler for calculate button click
document.getElementById("calculate-btn").addEventListener("click", function () {
    const dobInput = document.getElementById("dob").value;
    const currentDateInput = document.getElementById("current-date").value;

    // Validate date input format
    const dobPattern = /(\d{2})\/(\d{2})\/(\d{4})/;
    const currentDatePattern = /(\d{2})\/(\d{2})\/(\d{4})/;

    if (!dobPattern.test(dobInput) || !currentDatePattern.test(currentDateInput)) {
        alert("Please enter a valid date in DD/MM/YYYY format.");
        return;
    }

    // Extract day, month, and year from the date
    const [dobDay, dobMonth, dobYear] = dobInput.split("/").map(Number);
    const [currentDay, currentMonth, currentYear] = currentDateInput.split("/").map(Number);

    const dob = new Date(dobYear, dobMonth - 1, dobDay);
    const currentDate = new Date(currentYear, currentMonth - 1, currentDay);

    // Show error if birthdate is later than the current date
    if (dob > currentDate) {
        alert("The birth date cannot be in the future.");
        return;
    }

    // Calculate the difference between birthdate and current date
    const diffTime = currentDate - dob;
    const diffDate = new Date(diffTime);

    const years = diffDate.getUTCFullYear() - 1970;
    const months = diffDate.getUTCMonth();
    const days = diffDate.getUTCDate() - 1;

    const totalMonths = years * 12 + months;
    const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalHours = totalDays * 24;
    const totalMinutes = totalHours * 60;
    const totalSeconds = totalMinutes * 60;

    // Calculate next birthday
    const nextBirthday = new Date(dob);
    nextBirthday.setFullYear(currentDate.getFullYear());
    if (currentDate > nextBirthday) {
        nextBirthday.setFullYear(currentDate.getFullYear() + 1);
    }
    const daysToNextBirthday = Math.floor((nextBirthday - currentDate) / (1000 * 60 * 60 * 24));

    // Display results
    const result = `
        <h2>Your Age Details :</h2>
        <hr style="border-color: #4CAF50;">
        <p>${years} years ${months} months ${days} days</p>
        <p>Or ${totalMonths} months ${days} days</p>
        <p>Or ${totalWeeks} weeks ${totalDays % 7} days</p>
        <p>Or ${totalDays} days</p>
        <p>Or ${totalHours} hours</p>
        <p>Or ${totalMinutes} minutes</p>
        <p>Or ${totalSeconds} seconds</p>
        <p>Your next birthday is in ${Math.floor(daysToNextBirthday / 30)} months and ${daysToNextBirthday % 30} days.</p>
    `;

    document.getElementById("result").innerHTML = result;
    document.getElementById("download-btn").style.display = "inline-block"; // Show download button
});

// Event handler to download result as PDF
document.getElementById("download-btn").addEventListener("click", function () {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Get the result content from the HTML
    let resultContent = document.getElementById("result").innerHTML;

    // Use a temporary div to remove HTML tags
    const content = document.createElement("div");
    content.innerHTML = resultContent;

    // Add text to the PDF
    doc.setFont("helvetica", "normal");
    doc.text(content.innerText.trim(), 20, 30); // `trim()` removes any extra spaces

    // Add copyright text
    const copyrightText = "© Created by ARKA BARUA";
    doc.setFont("helvetica", "italic");
    doc.setTextColor(150, 150, 150); // Light gray color for copyright
    doc.text(copyrightText, 20, doc.internal.pageSize.height - 20); // Add copyright at the bottom of the PDF

    // Save the PDF file
    doc.save("Age_Details.pdf");
});