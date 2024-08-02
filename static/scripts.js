document.addEventListener('DOMContentLoaded', () => {
    const fraudForm = document.getElementById('fraudForm');
    const fraudType = document.getElementById('fraudType');
    const inputFields = document.getElementById('inputFields');
    const homePage = document.getElementById('homePage');
    const resultPage = document.getElementById('resultPage');
    const resultDiv = document.getElementById('result');
    const storyForm = document.getElementById('storyForm');
    const storiesDiv = document.getElementById('stories');

    fraudType.addEventListener('change', updateFields);
    fraudForm.addEventListener('submit', handleSubmit);
    storyForm.addEventListener('submit', handleStorySubmit);

    const transactionTypeMap = {
        "CASH_OUT": 1,
        "PAYMENT": 2,
        "CASH_IN": 3,
        "TRANSFER": 4,
        "DEBIT": 5
    };

    function updateFields() {
        const type = fraudType.value;
        inputFields.innerHTML = '';
        if (type === 'healthcare') {
            inputFields.innerHTML = `
                <label for="numberOfServices">Number of Services</label>
                <input type="text" id="numberOfServices" name="numberOfServices" required>
                <label for="avgSubmittedChargeAmount">Average Submitted Charge Amount</label>
                <input type="text" id="avgSubmittedChargeAmount" name="avgSubmittedChargeAmount" required>
                <label for="avgMedicarePaymentAmount">Average Medicare Payment Amount</label>
                <input type="text" id="avgMedicarePaymentAmount" name="avgMedicarePaymentAmount" required>
                <label for="avgMedicareStandardizedAmount">Average Medicare Standardized Amount</label>
                <input type="text" id="avgMedicareStandardizedAmount" name="avgMedicareStandardizedAmount" required>
                <label for="numMedicareBeneficiaries">Number of Medicare Beneficiaries</label>
                <input type="text" id="numMedicareBeneficiaries" name="numMedicareBeneficiaries" required>
            `;
        } else if (type === 'credit card') {
            inputFields.innerHTML = `
                <label for="transactionType">Transaction Type</label>
                <select id="transactionType" name="transactionType" required>
                    <option value="CASH_OUT">CASH OUT</option>
                    <option value="PAYMENT">PAYMENT</option>
                    <option value="CASH_IN">CASH IN</option>
                    <option value="TRANSFER">TRANSFER</option>
                    <option value="DEBIT">DEBIT</option>
                </select>
                <label for="amount">Amount</label>
                <input type="text" id="amount" name="amount" required>
                <label for="oldbalanceOrg">Original Balance</label>
                <input type="text" id="oldbalanceOrg" name="oldbalanceOrg" required>
                <label for="newbalanceOrig">New Balance</label>
                <input type="text" id="newbalanceOrig" name="newbalanceOrig" required>
            `;
        } else if (type === 'vehicle insurance') {
            inputFields.innerHTML = `
                <label for="months_as_customer">Months as Customer</label>
                <input type="text" id="months_as_customer" name="months_as_customer" required>
                <label for="policy_deductable">Policy Deductable</label>
                <input type="text" id="policy_deductable" name="policy_deductable" required>
                <label for="umbrella_limit">Umbrella Limit</label>
                <input type="text" id="umbrella_limit" name="umbrella_limit" required>
                <label for="capital_gains">Capital Gains</label>
                <input type="text" id="capital_gains" name="capital_gains" required>
                <label for="capital_loss">Capital Loss</label>
                <input type="text" id="capital_loss" name="capital_loss" required>
                <label for="incident_hour_of_the_day">Incident Hour of the Day</label>
                <input type="text" id="incident_hour_of_the_day" name="incident_hour_of_the_day" required>
                <label for="number_of_vehicles_involved">Number of Vehicles Involved</label>
                <input type="text" id="number_of_vehicles_involved" name="number_of_vehicles_involved" required>
                <label for="bodily_injuries">Bodily Injuries</label>
                <input type="text" id="bodily_injuries" name="bodily_injuries" required>
                <label for="witnesses">Witnesses</label>
                <input type="text" id="witnesses" name="witnesses" required>
                <label for="injury_claim">Injury Claim</label>
                <input type="text" id="injury_claim" name="injury_claim" required>
                <label for="property_claim">Property Claim:</label>
                <input type="text" id="property_claim" name="property_claim" required>
                <label for="vehicle_claim">Vehicle Claim</label>
                <input type="text" id="vehicle_claim" name="vehicle_claim" required>
                <label for="policy_csl">Policy CSL</label>
                <input type="text" id="policy_csl" name="policy_csl" required>
                <label for="insured_sex">Insured Sex</label>
                <input type="text" id="insured_sex" name="insured_sex" required>
                <label for="insured_education_level">Insured Education Level</label>
                <input type="text" id="insured_education_level" name="insured_education_level" required>
                <label for="insured_occupation">Insured Occupation</label>
                <input type="text" id="insured_occupation" name="insured_occupation" required>
                <label for="insured_relationship">Insured Relationship</label>
                <input type="text" id="insured_relationship" name="insured_relationship" required>
                <label for="incident_type">Incident Type</label>
                <input type="text" id="incident_type" name="incident_type" required>
                <label for="collision_type">Collision Type</label>
                <input type="text" id="collision_type" name="collision_type" required>
                <label for="incident_severity">Incident Severity</label>
                <input type="text" id="incident_severity" name="incident_severity" required>
                <label for="authorities_contacted">Authorities Contacted</label>
                <input type="text" id="authorities_contacted" name="authorities_contacted" required>
                <label for="property_damage">Property Damage</label>
                <input type="text" id="property_damage" name="property_damage" required>
                <label for="police_report_available">Police Report Available</label>
                <input type="text" id="police_report_available" name="police_report_available" required>
            `;
        }
    }

    function handleSubmit(event) {
        event.preventDefault();
        const type = fraudType.value;
        const formData = new FormData(fraudForm);
        const data = {
            type: type,
            data: []
        };

        const requiredFields = type === 'healthcare'
            ? ['numberOfServices', 'avgSubmittedChargeAmount', 'avgMedicarePaymentAmount', 'avgMedicareStandardizedAmount', 'numMedicareBeneficiaries']
            : type === 'credit card'
            ? ['transactionType', 'amount', 'oldbalanceOrg', 'newbalanceOrig']
            : ['months_as_customer', 'policy_deductable', 'umbrella_limit', 'capital_gains', 'capital_loss', 'incident_hour_of_the_day', 'number_of_vehicles_involved', 'bodily_injuries', 'witnesses', 'injury_claim', 'property_claim', 'vehicle_claim', 'policy_csl', 'insured_sex', 'insured_education_level', 'insured_occupation', 'insured_relationship', 'incident_type', 'collision_type', 'incident_severity', 'authorities_contacted', 'property_damage', 'police_report_available'];

        const invalidFields = [];
        for (const field of requiredFields) {
            if (!formData.get(field)) {
                invalidFields.push(field);
            }
        }
        if (invalidFields.length > 0) {
            alert(`Please fill out the following fields: ${invalidFields.join(', ')}`);
            return;
        }

        // Use form.get() to gather form data
        for (const field of requiredFields) {
            let value = formData.get(field);
            if (field === 'transactionType' && type === 'credit card') {
                value = transactionTypeMap[value];
            }
            data.data.push(value ? parseFloat(value) : null);
        }

        // Filter out any None values
        data.data = data.data.filter(value => value !== null);

        console.log('Data to send:', data);

        fetch('http://127.0.0.1:5000/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => {
            console.log('Received data:', result);
            resultDiv.textContent = `Prediction: ${result.result}`;
            homePage.style.display = 'none';
            resultPage.style.display = 'block';
        })
        .catch(error => {
            console.error('Error:', error);
            resultDiv.textContent = 'Error: Could not get prediction';
            homePage.style.display = 'none';
            resultPage.style.display = 'block';
        });
    }

    function handleStorySubmit(event) {
        event.preventDefault();
        const formData = new FormData(storyForm);

        fetch('/submit_story', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(story => {
            const storyElement = document.createElement('div');
            storyElement.className = 'story';
            storyElement.innerHTML = `
                <h3>${story.title}</h3>
                <p>${story.content}</p>
            `;
            storiesDiv.appendChild(storyElement);
            storyForm.reset();
        })
        .catch(error => console.error('Error:', error));
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // Other code...

    const goBackButton = document.getElementById('goBackButton');
    goBackButton.addEventListener('click', goBack);
});

function goBack() {
    // Navigate back to the home page
    window.location.href = '/template';
}
