import { rest } from 'msw';
import members from '../../data/members.json';

const memberHandlers = [
  rest.post('http://localhost:4000/members/register', (req, res, ctx) => {
    if (req.body === undefined || req.body.email === undefined || req.body.password === undefined) {
      return res(ctx.status(400), ctx.json({ errorMessage: 'Email and/or password undefined.' }));
    }
    if (req.body.password !== req.body.passwordConfirmation) {
      return res(ctx.status(400), ctx.json({
        errorMessage: 'Password confirmation do not match the password.',
      }));
    }
    return res(ctx.status(200), ctx.json({ user: req.body.email, token: req.body.password }));
  }),

  rest.post('http://localhost:4000/members/sign-in', (req, res, ctx) => {
    if (req.body === undefined || req.body.email === undefined
      || req.body.password === undefined || req.body.passwordConfirmation) {
      return res(ctx.status(400), ctx.json({ errorMessage: 'Register failed.' }));
    }
    const member = Array.from(members).find((registeredMember) => (
      registeredMember.email === req.body.email
    ));
    if (!member) {
      return res(ctx.status(400), ctx.json({ errorMessage: 'Member not found.' }));
    }
    if (member.password !== req.body.password) {
      return res(ctx.status(400), ctx.json({ errorMessage: 'Incorrect password.' }));
    }
    return res(ctx.status(200), ctx.json({ user: req.body.email, token: req.body.password }));
  }),

  rest.post('http://localhost:4000/members/validate-token', (req, res, ctx) => {
    const member = Array.from(members).find((registeredMember) => (
      registeredMember.email === req.body.user
    ));
    if (!member || member.password !== req.body.token) {
      return res(ctx.status(400), ctx.json({ errorMessage: 'Invalid token.' }));
    }
    return res(ctx.status(200), ctx.json({ message: 'Token validation successful.' }));
  }),
];

export default memberHandlers;
