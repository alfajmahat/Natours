const crypto = require('crypto');
const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, 'tour must have a name'],
        // unique: true,
        // trim:true,
        // maxlength:[40,'A tour name must have less than or equal to 40 characters'],
        // minlength:[10,'A tour name must have greater than or equal to 10 characters']
    },
    email: {
        type: String,
        required: [true, 'tour must have a email'],
        unique: true,
        trim: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide valid email']
    },
    photo: {
        type: String,
        default: 'default.jpg'
      },
    role: {
        type: String,
        enum: ["user", "guide", "lead-guide", "admin"],
        default: "user"
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 8,
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
            // THis only work on CREAT & SAVE
            validator: function (el) {
                return el === this.password;
            },
            message: 'Passwords are not the same'
        }
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active:{
        type:Boolean,
        default:true,
        select: false
    }
})

// only run this function if password was actually modified
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    //hash the password at the cost od 12
    this.password = await bcrypt.hash(this.password, 12)

    //Delete passwordConfirm field
    this.passwordConfirm = undefined;
    next()
})

userSchema.pre('save', function(next) {
    if (!this.isModified('password') || this.isNew) return next();
  
    this.passwordChangedAt = Date.now() - 1000;
    next();
  });
  
  userSchema.pre(/^find/, function(next) {
    // this points to the current query
    this.find({ active: { $ne: false } });
    next();
  });

userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword)
}

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10)
        return JWTTimestamp < changedTimestamp
    }
    //false means not changed
    return false
}

userSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');
  
    this.passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
  
    console.log({ resetToken }, this.passwordResetToken);
  
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  
    return resetToken;
  };
const User = mongoose.model('users', userSchema, 'users')

module.exports = User;