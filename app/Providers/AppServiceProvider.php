<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Filesystem\Filesystem;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Files singleton, ha szükséges
        if (! $this->app->bound('files')) {
            $this->app->singleton('files', function () {
                return new Filesystem();
            });
        }

        // **Ne legyen semmi MaintenanceMode bindolás!**
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
