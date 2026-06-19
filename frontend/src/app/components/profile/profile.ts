import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, UserProfile, UserUpdate } from '../../service/auth';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile implements OnInit {
  user: UserProfile | null = null;

  username = '';
  displayName = '';
  newPassword = '';
  confirmPassword = '';

  loading = true;
  saving = false;

  successMessage = '';
  errorMessage = '';

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.loading = true;
    this.errorMessage = '';

    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        this.user = user;
        this.username = user.username;
        this.displayName = user.displayName ?? '';
        this.loading = false;

        this.changeDetectorRef.detectChanges();
      },

      error: (error) => {
        this.loading = false;

        console.error('Erreur lors du chargement du profil', error);

        if (error.status === 401 || error.status === 403) {
          this.authService.clearSession();
          this.router.navigate(['/login']);
          return;
        }

        this.errorMessage = 'Impossible de charger les informations du profil.';

        this.changeDetectorRef.detectChanges();
      },
    });
  }

  saveProfile(): void {
    this.successMessage = '';
    this.errorMessage = '';

    if (!this.user) {
      return;
    }

    const update: UserUpdate = {};

    const normalizedUsername = this.username.trim();
    const normalizedDisplayName = this.displayName.trim();

    if (!normalizedUsername) {
      this.errorMessage = 'Le nom d’utilisateur est obligatoire.';
      return;
    }

    if (normalizedUsername !== this.user.username) {
      update.username = normalizedUsername;
    }

    if (normalizedDisplayName !== (this.user.displayName ?? '')) {
      update.displayName = normalizedDisplayName;
    }

    if (this.newPassword) {
      if (this.newPassword !== this.confirmPassword) {
        this.errorMessage = 'Les deux mots de passe ne correspondent pas.';
        return;
      }

      update.password = this.newPassword;
    }

    if (Object.keys(update).length === 0) {
      this.errorMessage = 'Aucune modification à enregistrer.';
      return;
    }

    this.saving = true;

    this.authService.updateCurrentUser(update).subscribe({
      next: (updatedUser) => {
        this.user = updatedUser;
        this.username = updatedUser.username;
        this.displayName = updatedUser.displayName ?? '';

        const passwordChanged = Boolean(update.password);

        this.newPassword = '';
        this.confirmPassword = '';
        this.saving = false;

        if (passwordChanged) {
          this.authService.clearSession();
          this.router.navigate(['/login']);
          return;
        }

        this.successMessage = 'Profil mis à jour avec succès.';

        this.changeDetectorRef.detectChanges();
      },
      error: (error) => {
        this.saving = false;

        console.error('Erreur lors de la mise à jour du profil', error);

        if (error.status === 409) {
          this.errorMessage = 'Ce nom d’utilisateur est déjà utilisé.';
        } else if (error.status === 400) {
          this.errorMessage = 'Les informations saisies ne sont pas valides.';
        } else if (error.status === 401 || error.status === 403) {
          this.authService.clearSession();
          this.router.navigate(['/login']);
        } else {
          this.errorMessage = 'Impossible de modifier le profil.';
        }
      },
    });
  }
}
