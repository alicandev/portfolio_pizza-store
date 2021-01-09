/* eslint-disable no-underscore-dangle */
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';

import MemberSchema from '../models/memberModel';

const Member = mongoose.model('Member', MemberSchema);

export const register = (req, res) => (!validationResult(req).isEmpty()
  ? res.status(400).send(
    validationResult(req).array().map((error) => ({ message: error.msg })),
  )
  : bcrypt.hash(
    req.body.password,
    10,
    (hashErr, hashPassword) => (hashErr
      ? res.status(500).send('Hashing failure.')
      : Member.findOne({ email: req.body.email })
        .then((findErr, existingMember) => {
          if (findErr) {
            res.status(500).send({ message: 'Failed to find member in the database.' });
          } else if (existingMember) {
            res.status(400).send({ message: 'Email already taken.' });
          } else {
            new Member({
              email: req.body.email,
              password: hashPassword,
            }).save((saveErr, newMember) => (saveErr
              ? res.status(500).send({ message: 'Failed to save member to the database.' })
              : res.status(200).send({ user: newMember._id, token: newMember.password })
            ));
          }
        })
    ),
  )
);

export const signIn = (req, res) => (
  !validationResult(req).isEmpty()
    ? res.status(400).send(
      validationResult(req).array().map((error) => ({ message: error.msg })),
    )
    : Member.findOne({ email: req.body.email }).then((member, dbErr) => {
      if (dbErr) {
        res.status(500).send({ message: 'Database failure.' });
      } else if (!member) {
        res.status(400).send({ message: 'Member not found.' });
      } else {
        bcrypt.compare(req.body.password, member.password, (hashErr, same) => {
          if (hashErr) {
            res.status(400).send({ message: 'Hashing failure.' });
          } else if (!same) {
            res.status(400).send({ message: 'Invalid password.' });
          } else {
            res.status(200).send({ user: member._id, token: member.password });
          }
        });
      }
    })
);

export const validateToken = (req, res) => (
  !validationResult(req).isEmpty()
    ? res.status(400).send(
      validationResult(req).array().map((error) => ({ message: error.msg })),
    )
    : Member.findOne({ _id: req.body.user }).then((member, err) => {
      if (err) {
        res.status(500).send({ message: 'Database failure.' });
      } else if (!member) {
        res.status(400).send({ message: 'Member not found.' });
      } else if (member.password && member.password !== req.body.token) {
        res.status(400).send({ message: 'Invalid authentication token.' });
      } else {
        res.status(200).send({ message: 'Token validation success.' });
      }
    })
);
