/* Change password fields type when clicked */
var togglePassBtn = $('.toggle-password');
var state = 0;

togglePassBtn.on('click', (e) => {
	e.preventDefault();
	
	// Verify state
	if (state == 0) {  // Invisible
		// Change state to 1
		state = 1;

		// Change password fields type text
		$('#password-input').attr('type', 'text');
	}
	else {  // Visible
		// Change state to 0
		state = 0;

		// Change password fields type to password
		$('#password-input').attr('type', 'password');
	}

	// Toggle button icon
	togglePassBtn.toggleClass('far fa-eye');
	togglePassBtn.toggleClass('far fa-eye-slash');
});