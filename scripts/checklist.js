const myCheckbox = document.getElementById('myCheckbox');

myCheckbox.addEventListener('change', (event) => {
    const isChecked = event.target.checked;
    if (auth.currentUser) {
        db.collection('users').doc(auth.currentUser.uid).update({
            checkbox: isChecked
        }).then(() => {
            console.log('Checkbox state updated.');
        }).catch((error) => {
            console.error('Error updating checkbox state:', error);
        });
    } else {
        alert('Please log in to save the checkbox state.');
    }
})

function checkCheckboxFirestore(){
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            console.log('Logged in as:', user.email);
            db.collection('users').doc(user.uid).get().then((doc) => {
                if (doc.exists) {
                    const checkboxChecked = doc.data().checkbox;
                    myCheckbox.checked = checkboxChecked;
                } else {
                    console.error('No such document!');
                }
            }).catch((error) => {
                console.error('Error getting document:', error);
            });
        } else {
            console.log('Logged out.');
        }
    });
}
checkCheckboxFirestore();

auth.onAuthStateChanged((user) => {
    if (user) {
        console.log('Logged in as:', user.email);
    } else {
        console.log('Logged out.');
    }
});