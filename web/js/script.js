document.addEventListener('DOMContentLoaded', () => {
    fetch('data/resume_data.json')
        .then(response => response.json())
        .then(data => {
            document.getElementById('name').textContent = data.name;
            populateContact(data.contact);
            populateProfessionalExperience(data.professional_experience);
            populateEducation(data.education);
            populateTechnologies(data.technologies);
            populateLanguages(data.languages);
            //TODO populateCertificates(data.certificates);
            //TODO populateProjects(data.projects);
            populateInterests(data.interests);
        });
});

function populateContact(contact) {
    const contactInfo = document.getElementById('contact-info');
    const icons = {
        "phone": "phone-alt",
        "email": "envelope",
        "website": "globe-americas",
        "github": "github",
        "linkedin": "linkedin-in"
    };

    const mainContactDiv = document.createElement('div');
    const socialContactDiv = document.createElement('div');

    Object.entries(contact).forEach(([key, value]) => {
        const container = document.createElement('div');
        container.className = 'contact-item';

        const icon = document.createElement('i');
        icon.className = `fa${key === 'github' || key === 'linkedin' ? 'b' : 's'} fa-${icons[key]}`;
        icon.style.color = 'black'; // icons color

        const text = document.createElement('a');
        switch (key) {
            case 'phone':
                text.href = `tel:${value.replace(/ /g,"")}`;
                text.textContent = value;
                break;
            case 'email':
                text.href = `mailto:${value}`;
                text.textContent = value;
                break;
            case 'website':
                text.href = `https://${value}`;
                text.textContent = value;
                break;
            case 'github':
            case 'linkedin':
                text.href = value;
                text.textContent = '/kszpieg';
                break;
            default:
                text.href = value;
                text.textContent = value;
                break;
        }
        text.style.color = 'blue'; // text color

        container.appendChild(icon);
        container.appendChild(text);

        if (key === 'website' || key === 'github' || key === 'linkedin') {
            socialContactDiv.appendChild(container);
        } else {
            mainContactDiv.appendChild(container);
        }
        
    });

    contactInfo.appendChild(mainContactDiv);
    contactInfo.appendChild(socialContactDiv);
}

function calculateDurationPeriod(start_date, end_date) {
    // Convert start_date and end_date into date objects
    const start = new Date(start_date);
    let end = end_date.toLowerCase() === 'present' ? new Date() : new Date(end_date);
    
    // Calculate the difference in years and months
    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth() + 1;
    
    // Adjust for month overflow
    if (months > 12) {
        years += 1;
        months -= 12;
    } else if (months === 12) {
        years += 1;
        months = 0;
    }

    // Adjust if end month is before the start month
    if (months < 0) {
        years--;
        months += 12;
    }
    
    // Build the duration string
    let result = [];
    if (years > 0) {
        result.push(years + ' yr' + (years > 1 ? 's' : ''));
    }
    if (months > 0) {
        result.push(months + ' m');
    }
    
    return result.join(', ');
}

function populateProfessionalExperience(experience) {
    const main = document.querySelector('main');
    const section = document.createElement('section');
    section.className = 'resume-part';
    
    const header = document.createElement('h2');
    header.className = 'section-header';
    header.textContent = 'Professional Experience';
    section.appendChild(header);
    
    experience.forEach(job => {
        const item = document.createElement('div');
        item.className = 'resume-item';
        
        const duration = document.createElement('div');
        duration.className = 'left-column';
        duration.innerHTML = `${job.start_date} — ${job.end_date}<p><span class='left-column-duration-period'>${calculateDurationPeriod(job.start_date, job.end_date)}</span>`;
        item.appendChild(duration);
        
        const details = document.createElement('div');
        details.className = 'right-column';
        
        const title = document.createElement('h3');
        title.textContent = `${job.position} at ${job.company}`;
        details.appendChild(title);
        
        const dutyHeader = document.createElement('h4');
        dutyHeader.textContent = 'Duties:';
        details.appendChild(dutyHeader);
        
        const dutiesList = document.createElement('ul');
        job.duties.forEach(duty => {
            const dutyItem = document.createElement('li');
            dutyItem.textContent = duty;
            dutyItem.className = 'item';
            dutiesList.appendChild(dutyItem);
        });
        details.appendChild(dutiesList);
        
        item.appendChild(details);
        section.appendChild(item);
    });
    
    main.appendChild(section);
}

function populateEducation(education) {
    const main = document.querySelector('main');
    const section = document.createElement('section');
    section.className = 'resume-part';
    
    const header = document.createElement('h2');
    header.className = 'section-header';
    header.textContent = 'Education';
    section.appendChild(header);
    
    education.forEach(studies => {
        const item = document.createElement('div');
        item.className = 'resume-item';
        
        const duration = document.createElement('div');
        duration.className = 'left-column';
        duration.innerHTML = `${studies.start_date} — ${studies.end_date}`;
        item.appendChild(duration);
        
        const details = document.createElement('div');
        details.className = 'right-column';
        
        const title = document.createElement('h3');
        title.textContent = `${studies.degree}, ${studies.university}`;
        details.appendChild(title);
        
        const thesisTitle = document.createElement('h4');
        thesisTitle.textContent = `Thesis topic: "${studies.thesis}"`;
        thesisTitle.className = 'item';
        details.appendChild(thesisTitle);
        
        item.appendChild(details);
        section.appendChild(item);
    });
    
    main.appendChild(section);
}

function formatCategory(category) {
    // Specific cases where the category needs to be uppercased
    const specialCases = {
        'vm': 'VM',
        'os': 'OS'
    };
    
    // Check if the category is a special case
    if (specialCases[category]) {
        return specialCases[category];
    }
    
    // Otherwise, capitalize the first letter
    return category.charAt(0).toUpperCase() + category.slice(1);
}

function populateTechnologies(technologies) {
    const main = document.querySelector('main');
    const section = document.createElement('section');
    section.className = 'resume-part';
    
    const header = document.createElement('h2');
    header.className = 'section-header';
    header.textContent = 'Technologies';
    section.appendChild(header);
    
    Object.entries(technologies).forEach(([category, items]) => {
        const item = document.createElement('div');
        item.className = 'resume-item';
        item.classList.add('resume-item-technologies');
        
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'left-column';
        categoryDiv.textContent = formatCategory(category);
        item.appendChild(categoryDiv);
        
        const technologiesList = document.createElement('div');
        technologiesList.className = 'right-column';
        items.forEach((technology, index) => {
            const techSpan = document.createElement('span');
            techSpan.className = 'item list';
            techSpan.textContent = technology;
            
            technologiesList.appendChild(techSpan);
            
            // If it's not the last item, add a comma and space
            if (index < items.length - 1) {
                technologiesList.appendChild(document.createTextNode(', '));
            }
        });

        item.appendChild(technologiesList);
        section.appendChild(item);
    });
    
    main.appendChild(section);
}

function populateLanguages(languages) {
    const main = document.querySelector('main');
    const section = document.createElement('section');
    section.className = 'resume-part';
    
    const header = document.createElement('h2');
    header.className = 'section-header';
    header.textContent = 'Languages';
    section.appendChild(header);

    const languageContainer = document.createElement('div');
    languageContainer.className = 'languages-part';

    Object.entries(languages).forEach(([key, value]) => {
        const languagesDiv = document.createElement('div');
        languagesDiv.className = 'resume-item-languages';
        languagesDiv.textContent = `${key} | ${value}`;

        languageContainer.appendChild(languagesDiv);
    });
    
    section.appendChild(languageContainer);
    main.appendChild(section);
}

function populateInterests(interests) {
    const main = document.querySelector('main');
    const section = document.createElement('section');
    section.className = 'resume-part';
    
    const header = document.createElement('h2');
    header.className = 'section-header';
    header.textContent = 'Interests';
    section.appendChild(header);

    const interestsContainer = document.createElement('div');
    interestsContainer.className = 'resume-item';

    // Create a list of interests
    const interestsList = document.createElement('p');
    interestsList.textContent = interests.join(', '); // Join the array items with a comma and space
    interestsList.className = 'interests-list';

    // Add the list to the interests container
    interestsContainer.appendChild(interestsList);

    // Add the interests container to the section
    section.appendChild(interestsContainer);
    main.appendChild(section);
}
