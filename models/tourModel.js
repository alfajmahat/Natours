
const mongoose = require('mongoose')
const User = require('./userModel');
// const Review = require('./reviewModel');



const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'tour must have a name'],
        unique: true,
        trim: true,
        maxlength: [40, 'A tour name must have less than or equal to 40 characters'],
        minlength: [10, 'A tour name must have greater than or equal to 10 characters']
    },
    duration: {
        type: Number,
        required: [true, 'tour must have a duration']
    },
    maxGroupSize: {
        type: Number,
        required: [true, 'tour must have a Group size']
    },
    difficulty: {
        type: String,
        required: [true, 'tour must have a difficulty'],
        enum: {
            values: ['easy', 'medium', 'difficult'],
            message: 'Diifficulty is either: easy, medium, difficult'
        }
    },
    ratingAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must have above 1.0'],
        max: [5, 'Rating must have below 5.0'],
        set: val => Math.round(val * 10) / 10 // 4.666666, 46.6666, 47, 4.7
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    rating: {
        type: Number,
        default: 4.0
    },
    price: {
        type: Number,
        required: [true, 'tour must have a price']
    },
    priceDiscount: {
        type: Number,
        validate: {
            validator: function (val) {
                return val < this.price
            },
            message: 'Discount price (${VALUE}) shoud be less than regular price'
        }
    },
    summary: {
        type: String,
        trim: true,
        required: [true, 'tour must have a description']
    },
    description: {
        type: String,
        trim: true
    },
    imageCover: {
        type: String,
        required: [true, 'tour must have a cover image']
    },
    images: [String],
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    },
    startDates: [Date],
    startLocation: {
        // GeoJSON
        type: {
            type: String,
            default: 'Point',
            enum: ['Point']
        },
        /* coordinates: [Number],
        address: String,
        description: String */
        coordinates: {
            type: [Number],
            default: [0, 0]
          },
          address: String,
          description: String
    },
    locations: [
        {
            type: {
                type: String,
                default: 'Point',
                enum: ['Point']
            },
            coordinates: [Number],
            address: String,
            description: String,
            day: Number
        }
    ],
    guides: [
        {
            type: mongoose.Schema.ObjectId,
            ref: User
        }
    ],
},
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },

    }
)

// tourSchema.index({ price: 1 });
tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: '2dsphere' });

tourSchema.virtual('durationWeeks').get(function () {
    return this.duration / 7;
})

// Virtual populate
tourSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'tour',
    localField: '_id'
  });

//Populating guides --> instead of showing ID's show all guide info
tourSchema.pre(/^find/, function(next) {
    this.populate({
      path: 'guides',
      select: '-__v -passwordChangedAt'
    });
  
    next();
  });

/* tourSchema.pre('save', async function(next) {
  const guidesPromises = this.guides.map(async id => await User.findById(id));
  this.guides = await Promise.all(guidesPromises);
  next();
}); */

const Tour = mongoose.model('tours', tourSchema, 'tours')

module.exports = Tour;