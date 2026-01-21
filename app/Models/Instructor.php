<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Instructor extends Model
{
    protected $fillable = ['name', 'email', 'expertise'];

    public function courses()
    {
        return $this->hasMany(Course::class);
    }
}



