/* @flow */

import { MAX_CHAT_MESSAGES } from '../core/constants';

import type { Action } from '../actions/types';

export type ChatState = {
  /*
   * {
   *   cid: [
   *     name,
   *     type,
   *     lastTs,
   *   ],
   *   cid2: [
   *     name,
   *     type,
   *     lastTs,
   *     dmUserId,
   *   ],
   *   ...
   * }
   */
  channels: Object,
  // [[uId, userName], [userId2, userName2],...]
  blocked: Array,
  // { cid: [message1,message2,message3,...]}
  messages: Object,
}

const initialState: ChatState = {
  channels: {},
  blocked: [],
  messages: {},
};

export default function chat(
  state: ChatState = initialState,
  action: Action,
): ChatState {
  switch (action.type) {
    case 'RECEIVE_ME':
    case 'LOGIN': {
      // making sure object keys are numbers
      const channels = {};
      const channelsJson = action.channels;
      const cids = Object.keys(channelsJson);
      for (let i = 0; i < cids.length; i += 1) {
        const cid = cids[i];
        channels[Number(cid)] = channelsJson[cid];
      }
      return {
        ...state,
        channels,
        blocked: action.blocked,
      };
    }

    case 'LOGOUT': {
      const channels = { ...state.channels };
      const messages = { ...state.messages };
      const keys = Object.keys(channels);
      for (let i = 0; i < keys.length; i += 1) {
        const cid = keys[i];
        if (channels[cid][1] === 0) {
          delete messages[cid];
          delete channels[cid];
        }
      }
      return {
        ...state,
        channels,
        blocked: [],
        messages,
      };
    }

    case 'BLOCK_USER': {
      const { userId, userName } = action;
      const blocked = [
        ...state.blocked,
        [userId, userName],
      ];
      /*
       * remove DM channel if exists
       */
      const channels = { ...state.channels };
      const chanKeys = Object.keys(channels);
      for (let i = 0; i < chanKeys.length; i += 1) {
        const cid = chanKeys[i];
        if (channels[cid][1] === 1 && channels[cid][3] === userId) {
          delete channels[cid];
          return {
            ...state,
            channels,
            blocked,
          };
        }
      }
      return {
        ...state,
        blocked,
      };
    }

    case 'UNBLOCK_USER': {
      const { userId } = action;
      const blocked = state.blocked.filter((bl) => (bl[0] !== userId));
      return {
        ...state,
        blocked,
      };
    }

    case 'ADD_CHAT_CHANNEL': {
      const { channel } = action;
      const cid = Number(Object.keys(channel)[0]);
      if (state.channels[cid]) {
        return state;
      }
      return {
        ...state,
        channels: {
          ...state.channels,
          ...channel,
        },
      };
    }

    case 'REMOVE_CHAT_CHANNEL': {
      const { cid } = action;
      if (!state.channels[cid]) {
        return state;
      }
      const channels = { ...state.channels };
      const messages = { ...state.messages };
      delete messages[cid];
      delete channels[cid];
      return {
        ...state,
        channels,
        messages,
      };
    }

    case 'RECEIVE_CHAT_MESSAGE': {
      const {
        name, text, country, channel, user,
      } = action;
      if (!state.messages[channel] || !state.channels[channel]) {
        return state;
      }
      const messages = {
        ...state.messages,
        [channel]: [
          ...state.messages[channel],
          [name, text, country, user],
        ],
      };
      if (messages[channel].length > MAX_CHAT_MESSAGES) {
        messages[channel].shift();
      }

      /*
       * update timestamp of last message
       */
      const channelArray = [...state.channels[channel]];
      channelArray[2] = Date.now();

      return {
        ...state,
        channels: {
          ...state.channels,
          [channel]: channelArray,
        },
        messages,
      };
    }

    case 'RECEIVE_CHAT_HISTORY': {
      const { cid, history } = action;
      return {
        ...state,
        messages: {
          ...state.messages,
          [cid]: history,
        },
      };
    }

    default:
      return state;
  }
}
