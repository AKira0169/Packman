const catchAsync = require('./../Utiles/catchAsync');

const AppError = require('./../Utiles/appError');

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findOneAndDelete({ serial: req.params.serial });
    if (!doc) {
      return next(new AppError('No document found with that Serial', 404));
    }
    res.status(204).json({
      status: 'success',
      data: null,
    });
  });
