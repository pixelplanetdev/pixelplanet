/* @flow */

import sequelize from '../sequelize';
import Blacklist from './Blacklist';
import Whitelist from './Whitelist';
import User from './User';
import RegUser from './RegUser';
import Channel from './Channel';
import UserChannel from './UserChannel';
import Message from './Message';
import UserBlock from './UserBlock';

/*
 * User Channel access
 */
RegUser.belongsToMany(Channel, {
  as: 'channel',
  through: UserChannel,
});
Channel.belongsToMany(RegUser, {
  as: 'user',
  through: UserChannel,
});

/*
 * User blocks of other user
 *
 * uid: User that blocks
 * buid: User that is blocked
 */
RegUser.belongsToMany(RegUser, {
  as: 'blocked',
  through: UserBlock,
  foreignKey: 'uid',
});
RegUser.belongsToMany(RegUser, {
  as: 'blockedBy',
  through: UserBlock,
  foreignKey: 'buid',
});

function sync(...args) {
  return sequelize.sync(...args);
}

export default { sync };
export {
  Whitelist,
  Blacklist,
  User,
  RegUser,
  Channel,
  UserChannel,
  Message,
  UserBlock,
};
