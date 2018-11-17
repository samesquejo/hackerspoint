<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class User extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'email',
        'password',
        'role',
    ];

    protected $date = [
        'deleted_at'
    ];

    
}
