const Thought  = require('../models/Thought');
const User = require('../models/User');

const thoughtController = {
    getAllThoughts(req, res) {
        Thought.find({})
                .then(thoughtsData => res.json(thoughtsData))
                .catch(err => {
                    console.log(err);
                    res.status(404).json(err);
                })
    },

    getThoughtById({ params }, res) {
        Thought.findOne({ _id: thoughtId })
                .then(thoughtsData => {
                    if (!thoughtsData) {
                        res.status(404).json({ message: 'No thought found with this ID!' });
                        return;
                    }
                    res.json(thoughtsData);
                })
                .catch(err => {
                    console.log(err);
                    res.status(404).json(err);
                })
    },

    addThought({ params, body }, res) {
        console.log(body);
        Thought.create(body)
                .then(({ _id }) => {
                    return User.findOneAndUpdate(
                        { _id: params.userId },
                        { $push: {thoughts: _id } },
                        { new: true }
                    )
                })
                .then(thoughtsData => {
                    if (!thoughtsData) {
                        res.status(404).json({ message: 'No user found with this ID!' });
                        return;
                    }
                    res.json(thoughtsData);
                })
                .catch(err => res.status(404).json(err));
    },

    updateThought({ params, body}, res) {
        Thought.findOneAndUpdate({ _id: params.thoughtId }, body, { new: true, runValidators: true })
                .then(thoughtsData => {
                    if (!thoughtsData) {
                        res.status(404).json({ message: 'No thought with this ID!' });
                        return;
                    }
                    res.json(thoughtsData);
                })
                .catch(err => res.status(404).json(err));
    },

    removeThought({ params }, res) {
        Thought.findOneAndUpdate({ _id: params.thoughtId })
                .then(thoughtsData => {
                    if (!thoughtsData) {
                        res.status(404).json({ message: 'No thought with this ID!' })
                        return;
                    }
                    res.json(thoughtsData);
                })
                .catch(err => res.json(err));
    },

    addReaction({ params, body }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $addToSet: { reactions: body } },
            { new: true, runValidators: true }
        )
                .then(thoughtsData => {
                    if (!thoughtsData) {
                        return res.status(404).json({ message: 'No thought found with this ID!' });
                    }
                    res.json(thoughtsData);
                })
                .catch(err => res.json(err));
    },

    removeReaction({ params }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $pull: { reactions: { reactionId: params.reactionId } } },
            { new: true, runValidators: true }
        )
                .then(thoughtsData => res.json(thoughtsData))
                .catch(err => res.json(err));
    }
};

module.exports = thoughtController;