const { User, Thought } = require('../models');

const userController = {
    getAllUsers(req, res) {
        User.find({})
            .then(userData => res.json(userData))
            .catch(err => {
                console.log(err);
                res.status(404).json(err);
            });
    },

    getUserById({ params }, res) {
        User.findOne({ _id: params.id })
            .populate('thoughts')
            .populate('friends')
            .select('-__v')
            .then(userData => {
                if (!userData) {
                    res.status(404).json({ message: 'No user found with this ID!'});
                    return;
                }
                res.json(userData);
            })
            .catch(err => {
                console.log(err);
                res.status(404).json(err);
            });
    },

    createUser({ body }, res) {
        User.create(body)
            .then(userData => res.json(userData))
            .catch(err => res.status(404).json(err));
    },

    updateUser({ params, body }, res) {
        User.findOneAndUpdate({ _id: params.id }, body, {new: true, runValidators: true })
            .then(userData => {
                if (!userData) {
                    res.status(404).json({ message: 'No user found with this ID!' });
                    return;
                }
                res.json(userData);
            })
            .catch(err => res.status(404).json(err));
    },

    deleteUser({ params }, res) {
        User.findOneAndDelete({ _id: params.id })
            .then(userData => {
                if (!userData) {
                    return res.status(404).json({ message: 'No user found with this ID!' });
                }
            })
            .then(() => {
                res.json({ message: 'User Deleted!' });
            })
            .catch(err => res.status(404).json(err));
    },

    addFriend({ params}, res) {
        User.findOneAndUpdate({ _id: params.id }, { $addToSet: { friends: params.friendId } }, { runValidators: true })
            .then(userData => {
                if (!userData) {
                    res.status(404).json({ message: 'No user found with this ID!' });
                    return;
                }
                res.json(userData);
            })
            .catch(err => res.status(404).json(err));
    },

    removeFriend({ params }, res) {
        User.findOneAndUpdate({ _id: params.id }, { $pull: { friends: params.friendId } }, { runValidators: true })
            .then(userData => {
                if (!userData) {
                    res.status(404).json({ message: 'No user found with this ID!' });
                    return;
                }
                res.json(userData);
            })
            .catch(err => res.status(404).json(err));
    }
}

module.exports = userController;