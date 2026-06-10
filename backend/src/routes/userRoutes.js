const router = require('express').Router();
const { protect } = require('../middlewares/authMiddleware');
const { isAdmin } = require('../middlewares/roleMiddleware');
const { getUsers, updateUserRole, deleteUser } = require('../controllers/userController');

router.use(protect, isAdmin);
router.get('/', getUsers);
router.patch('/:id/role', updateUserRole);
router.delete('/:id', deleteUser);

module.exports = router;