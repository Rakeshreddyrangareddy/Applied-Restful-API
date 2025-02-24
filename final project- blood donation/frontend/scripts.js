const apiUrl = 'http://localhost:5000/api/donations';

document.addEventListener('DOMContentLoaded', () => {
  const donationList = document.getElementById('donationList');

  if (donationList) {
    fetch(apiUrl)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch donations.');
        return res.json();
      })
      .then(donations => {
        donationList.innerHTML = '';

        if (donations.length === 0) {
          donationList.innerHTML = '<li>No donations found.</li>';
        } else {
          donations.forEach(donation => {
            const li = document.createElement('li');
            li.innerHTML = `
              <strong>Name:</strong> ${donation.name}<br>
              <strong>Blood Type:</strong> ${donation.bloodType}<br>
              <strong>Contact:</strong> ${donation.contact}<br>
              <strong>Date:</strong> ${new Date(donation.date).toLocaleDateString()}<br>
              <strong>Donation ID:</strong> <span id="donation-id-${donation._id}">${donation._id}</span><br>
            `;

            const copyBtn = document.createElement('button');
            copyBtn.textContent = 'Copy ID';
            copyBtn.onclick = () => {
              navigator.clipboard.writeText(donation._id).then(() => {
                alert('Donation ID copied to clipboard!');
              });
            };

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete Donation';
            deleteBtn.onclick = async () => {
              if (confirm('Are you sure you want to delete this donation?')) {
                const response = await fetch(`${apiUrl}/${donation._id}`, { method: 'DELETE' });
                if (response.ok) {
                  alert('Donation Deleted!');
                  li.remove();
                } else {
                  alert('Failed to delete donation.');
                }
              }
            };

            li.appendChild(copyBtn);
            li.appendChild(deleteBtn);
            donationList.appendChild(li);
          });
        }
      })
      .catch(err => {
        console.error(err);
        donationList.innerHTML = '<li>Error loading donations.</li>';
      });
  }
});