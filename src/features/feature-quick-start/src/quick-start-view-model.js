import { QuickStartService } from './quick-start-service.js'

export class QuickStartViewModel {
    name = '';
    email = '';
    language = 'en';
    loading = false;
    error = null;

    async quickStart() {
        this.loading = true;
        this.error = null;
        try {
            const response = await QuickStartService.startQuickGame({
                name: this.name,
                email: this.email,
                language: this.language
            });
        } catch (err) {
            this.error = err.message;
        } finally {
            this.loading = false;
        }
    }
}