import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './login.html',
})
export class Login {
    email = '';
    password = '';
    error = '';

    constructor(private authService: AuthService, private router: Router) {}

    onSubmit(): void {
        this.error = '';

        this.authService.login(this.email, this.password).subscribe({
            next: () => this.router.navigate(['/publicaciones']),
            error: () => (this.error = 'Credenciales inválidas'),
        });
    }
}