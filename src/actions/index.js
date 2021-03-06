/* @flow */

import { t } from 'ttag';

import type {
  Action,
  ThunkAction,
  PromiseAction,
} from './types';
import type { Cell } from '../core/Cell';
import type { ColorIndex } from '../core/Palette';
import {
  requestStartDm,
  requestBlock,
  requestBlockDm,
  requestLeaveChan,
} from './fetch';

export function sweetAlert(
  title: string,
  text: string,
  icon: string,
  confirmButtonText: string,
): Action {
  return {
    type: 'ALERT',
    title,
    text,
    icon,
    confirmButtonText,
  };
}

export function closeAlert(): Action {
  return {
    type: 'CLOSE_ALERT',
  };
}

export function toggleHistoricalView(): Action {
  return {
    type: 'TOGGLE_HISTORICAL_VIEW',
  };
}

export function toggleHiddenCanvases(): Action {
  return {
    type: 'TOGGLE_HIDDEN_CANVASES',
  };
}

export function toggleGrid(): Action {
  return {
    type: 'TOGGLE_GRID',
  };
}

export function togglePixelNotify(): Action {
  return {
    type: 'TOGGLE_PIXEL_NOTIFY',
  };
}

export function toggleAutoZoomIn(): Action {
  return {
    type: 'TOGGLE_AUTO_ZOOM_IN',
  };
}

export function toggleMute(): Action {
  return {
    type: 'TOGGLE_MUTE',
  };
}

export function toggleCompactPalette(): Action {
  return {
    type: 'TOGGLE_COMPACT_PALETTE',
  };
}

export function toggleChatNotify(): Action {
  return {
    type: 'TOGGLE_CHAT_NOTIFY',
  };
}

export function togglePotatoMode(): Action {
  return {
    type: 'TOGGLE_POTATO_MODE',
  };
}

export function toggleLightGrid(): Action {
  return {
    type: 'TOGGLE_LIGHT_GRID',
  };
}

export function toggleOpenPalette(): Action {
  return {
    type: 'TOGGLE_OPEN_PALETTE',
  };
}

export function selectStyle(style: string): Action {
  return {
    type: 'SELECT_STYLE',
    style,
  };
}

export function toggleOpenMenu(): Action {
  return {
    type: 'TOGGLE_OPEN_MENU',
  };
}

export function setRequestingPixel(requestingPixel: boolean): Action {
  return {
    type: 'SET_REQUESTING_PIXEL',
    requestingPixel,
  };
}

export function setNotification(notification: string): Action {
  return {
    type: 'SET_NOTIFICATION',
    notification,
  };
}

export function unsetNotification(): Action {
  return {
    type: 'UNSET_NOTIFICATION',
  };
}

export function setHover(hover: Cell): Action {
  return {
    type: 'SET_HOVER',
    hover,
  };
}

export function unsetHover(): Action {
  return {
    type: 'UNSET_HOVER',
  };
}

export function setWait(wait: ?number): Action {
  return {
    type: 'SET_WAIT',
    wait,
  };
}

export function setMobile(mobile: boolean): Action {
  return {
    type: 'SET_MOBILE',
    mobile,
  };
}

export function windowResize(): Action {
  return {
    type: 'WINDOW_RESIZE',
  };
}

export function selectColor(color: ColorIndex): Action {
  return {
    type: 'SELECT_COLOR',
    color,
  };
}

export function selectCanvas(canvasId: number): Action {
  return {
    type: 'SELECT_CANVAS',
    canvasId,
  };
}

export function placedPixels(amount: number): Action {
  return {
    type: 'PLACED_PIXELS',
    amount,
  };
}

export function pixelWait(): Action {
  return {
    type: 'PIXEL_WAIT',
  };
}

export function pixelFailure(): Action {
  return {
    type: 'PIXEL_FAILURE',
  };
}

export function receiveOnline(online: number): Action {
  return {
    type: 'RECEIVE_ONLINE',
    online,
  };
}

export function receiveChatMessage(
  name: string,
  text: string,
  country: string,
  channel: number,
  user: number,
  isPing: boolean,
  isRead: boolean,
): Action {
  return {
    type: 'RECEIVE_CHAT_MESSAGE',
    name,
    text,
    country,
    channel,
    user,
    isPing,
    isRead,
  };
}

let lastNotify = null;
export function notify(notification: string) {
  return async (dispatch) => {
    dispatch(setNotification(notification));
    if (lastNotify) {
      clearTimeout(lastNotify);
      lastNotify = null;
    }
    lastNotify = setTimeout(() => {
      dispatch(unsetNotification());
    }, 1500);
  };
}

export function setViewCoordinates(view: Cell): Action {
  return {
    type: 'SET_VIEW_COORDINATES',
    view,
  };
}

export function move([dx, dy]: Cell): ThunkAction {
  return (dispatch, getState) => {
    const { view } = getState().canvas;

    const [x, y] = view;
    dispatch(setViewCoordinates([x + dx, y + dy]));
  };
}

export function moveDirection([vx, vy]: Cell): ThunkAction {
  return (dispatch, getState) => {
    const { viewscale } = getState().canvas;

    const speed = 100.0 / viewscale;
    dispatch(move([speed * vx, speed * vy]));
  };
}

export function moveNorth(): ThunkAction {
  return (dispatch) => {
    dispatch(moveDirection([0, -1]));
  };
}

export function moveWest(): ThunkAction {
  return (dispatch) => {
    dispatch(moveDirection([-1, 0]));
  };
}

export function moveSouth(): ThunkAction {
  return (dispatch) => {
    dispatch(moveDirection([0, 1]));
  };
}

export function moveEast(): ThunkAction {
  return (dispatch) => {
    dispatch(moveDirection([1, 0]));
  };
}

export function setScale(scale: number, zoompoint: Cell): Action {
  return {
    type: 'SET_SCALE',
    scale,
    zoompoint,
  };
}

export function zoomIn(zoompoint): ThunkAction {
  return (dispatch, getState) => {
    const { scale } = getState().canvas;
    const zoomscale = scale >= 1.0 ? scale * 1.1 : scale * 1.04;
    dispatch(setScale(zoomscale, zoompoint));
  };
}

export function zoomOut(zoompoint): ThunkAction {
  return (dispatch, getState) => {
    const { scale } = getState().canvas;
    const zoomscale = scale >= 1.0 ? scale / 1.1 : scale / 1.04;
    dispatch(setScale(zoomscale, zoompoint));
  };
}

export function requestBigChunk(center: Cell): Action {
  return {
    type: 'REQUEST_BIG_CHUNK',
    center,
  };
}

export function preLoadedBigChunk(
  center: Cell,
): Action {
  return {
    type: 'PRE_LOADED_BIG_CHUNK',
    center,
  };
}

export function receiveBigChunk(
  center: Cell,
  chunk: Uint8Array,
): Action {
  return {
    type: 'RECEIVE_BIG_CHUNK',
    center,
    chunk,
  };
}

export function receiveBigChunkFailure(center: Cell, error: Error): Action {
  return {
    type: 'RECEIVE_BIG_CHUNK_FAILURE',
    center,
    error,
  };
}

export function receiveCoolDown(
  wait: number,
): Action {
  return {
    type: 'RECEIVE_COOLDOWN',
    wait,
  };
}

export function updatePixel(
  i: number,
  j: number,
  offset: number,
  color: ColorIndex,
): Action {
  return {
    type: 'UPDATE_PIXEL',
    i,
    j,
    offset,
    color,
  };
}

export function loginUser(
  me: Object,
): Action {
  return {
    type: 'LOGIN',
    ...me,
  };
}

export function receiveMe(
  me: Object,
): Action {
  return {
    type: 'RECEIVE_ME',
    ...me,
  };
}

export function logoutUser(
): Action {
  return {
    type: 'LOGOUT',
  };
}

export function receiveStats(
  rankings: Object,
): Action {
  const { ranking: totalRanking, dailyRanking: totalDailyRanking } = rankings;
  return {
    type: 'RECEIVE_STATS',
    totalRanking,
    totalDailyRanking,
  };
}

export function setName(
  name: string,
): Action {
  return {
    type: 'SET_NAME',
    name,
  };
}

export function setMailreg(
  mailreg: boolean,
): Action {
  return {
    type: 'SET_MAILREG',
    mailreg,
  };
}

export function remFromMessages(
  message: string,
): Action {
  return {
    type: 'REM_FROM_MESSAGES',
    message,
  };
}

export function fetchStats(): PromiseAction {
  return async (dispatch) => {
    const response = await fetch('api/ranking', { credentials: 'include' });
    if (response.ok) {
      const rankings = await response.json();

      dispatch(receiveStats(rankings));
    }
  };
}

export function fetchMe(): PromiseAction {
  return async (dispatch) => {
    const response = await fetch('api/me', {
      credentials: 'include',
    });

    if (response.ok) {
      const me = await response.json();
      dispatch(receiveMe(me));
    }
  };
}

function receiveChatHistory(
  cid: number,
  history: Array,
): Action {
  return {
    type: 'RECEIVE_CHAT_HISTORY',
    cid,
    history,
  };
}

function setChatFetching(fetching: boolean): Action {
  return {
    type: 'SET_CHAT_FETCHING',
    fetching,
  };
}

function setApiFetching(fetching: boolean): Action {
  return {
    type: 'SET_API_FETCHING',
    fetching,
  };
}

export function fetchChatMessages(
  cid: number,
): PromiseAction {
  return async (dispatch) => {
    dispatch(setChatFetching(true));
    const response = await fetch(`api/chathistory?cid=${cid}&limit=50`, {
      credentials: 'include',
    });

    /*
     * timeout in order to not spam api requests and get rate limited
     */
    if (response.ok) {
      setTimeout(() => { dispatch(setChatFetching(false)); }, 500);
      const { history } = await response.json();
      dispatch(receiveChatHistory(cid, history));
    } else {
      setTimeout(() => { dispatch(setChatFetching(false)); }, 5000);
    }
  };
}

function setCoolDown(coolDown): Action {
  return {
    type: 'COOLDOWN_SET',
    coolDown,
  };
}

function endCoolDown(): Action {
  return {
    type: 'COOLDOWN_END',
  };
}

function getPendingActions(state): Array<Action> {
  const actions = [];
  const now = Date.now();

  const { wait } = state.user;

  const coolDown = wait - now;

  if (wait !== null && wait !== undefined) {
    if (coolDown > 0) actions.push(setCoolDown(coolDown));
    else actions.push(endCoolDown());
  }

  return actions;
}

export function initTimer(): ThunkAction {
  return (dispatch, getState) => {
    function tick() {
      const state = getState();
      const actions = getPendingActions(state);
      dispatch(actions);
    }

    // something shorter than 1000 ms
    setInterval(tick, 333);
  };
}

/*
 * fullscreen means to open as modal
 */
export function openWindow(
  windowType: string,
  title: string,
  fullscreen: boolean,
  cloneable: boolean,
  args: Object,
  xPos: number = null,
  yPos: number = null,
  width: number = null,
  height: number = null,
): Action {
  return {
    type: 'OPEN_WINDOW',
    windowType,
    title,
    fullscreen,
    cloneable,
    args,
    xPos,
    yPos,
    width,
    height,
  };
}

export function showModal(modalType: string, title: string): Action {
  return openWindow(
    modalType,
    title,
    true,
    false,
    {},
  );
}

export function showSettingsModal(): Action {
  return showModal(
    'SETTINGS',
    '',
  );
}

export function showUserAreaModal(): Action {
  return showModal(
    'USERAREA',
    '',
  );
}

export function changeWindowType(windowId, windowType, args = null) {
  return {
    type: 'CHANGE_WINDOW_TYPE',
    windowId,
    windowType,
    args,
  };
}

export function setWindowTitle(windowId, title) {
  return {
    type: 'SET_WINDOW_TITLE',
    windowId,
    title,
  };
}

export function showRegisterModal(): Action {
  return showModal(
    'REGISTER',
    t`Register New Account`,
  );
}

export function showForgotPasswordModal(): Action {
  return showModal(
    'FORGOT_PASSWORD',
    t`Restore my Password`,
  );
}

export function showHelpModal(): Action {
  return showModal(
    'HELP',
    t`Welcome to PixelPlanet.fun`,
  );
}
export function showArchiveModal(): Action {
  return showModal(
    'ARCHIVE',
    t`Look at past Canvases`,
  );
}

export function showCanvasSelectionModal(): Action {
  return showModal(
    'CANVAS_SELECTION',
    '',
  );
}

export function showContextMenu(
  menuType: string,
  xPos: number,
  yPos: number,
  args: Object,
): Action {
  return {
    type: 'SHOW_CONTEXT_MENU',
    menuType,
    xPos,
    yPos,
    args,
  };
}

export function openChatChannel(cid: number): Action {
  return {
    type: 'OPEN_CHAT_CHANNEL',
    cid,
  };
}

export function closeChatChannel(cid: number): Action {
  return {
    type: 'CLOSE_CHAT_CHANNEL',
    cid,
  };
}

export function addChatChannel(channel: Object): Action {
  return {
    type: 'ADD_CHAT_CHANNEL',
    channel,
  };
}

export function blockUser(userId: number, userName: string): Action {
  return {
    type: 'BLOCK_USER',
    userId,
    userName,
  };
}

export function unblockUser(userId: number, userName: string): Action {
  return {
    type: 'UNBLOCK_USER',
    userId,
    userName,
  };
}

export function blockingDm(blockDm: boolean): Action {
  return {
    type: 'SET_BLOCKING_DM',
    blockDm,
  };
}

export function removeChatChannel(cid: number): Action {
  return {
    type: 'REMOVE_CHAT_CHANNEL',
    cid,
  };
}

export function muteChatChannel(cid: number): Action {
  return {
    type: 'MUTE_CHAT_CHANNEL',
    cid,
  };
}

export function unmuteChatChannel(cid: number): Action {
  return {
    type: 'UNMUTE_CHAT_CHANNEL',
    cid,
  };
}

export function setChatChannel(windowId: number, cid: number): Action {
  return {
    type: 'SET_CHAT_CHANNEL',
    windowId,
    cid: Number(cid),
  };
}

export function setChatInputMessage(windowId: number, msg: string): Action {
  return {
    type: 'SET_CHAT_INPUT_MSG',
    windowId,
    msg,
  };
}

export function addToChatInputMessage(windowId: number, msg: string): Action {
  return {
    type: 'ADD_CHAT_INPUT_MSG',
    windowId,
    msg,
  };
}

export function closeWindow(windowId): Action {
  return {
    type: 'CLOSE_WINDOW',
    windowId,
  };
}

export function removeWindow(windowId): Action {
  return {
    type: 'REMOVE_WINDOW',
    windowId,
  };
}

export function focusWindow(windowId): Action {
  return {
    type: 'FOCUS_WINDOW',
    windowId,
  };
}

export function cloneWindow(windowId): Action {
  return {
    type: 'CLONE_WINDOW',
    windowId,
  };
}

export function maximizeWindow(windowId): Action {
  return {
    type: 'MAXIMIZE_WINDOW',
    windowId,
  };
}

export function restoreWindow(): Action {
  return {
    type: 'RESTORE_WINDOW',
  };
}

export function moveWindow(windowId, xDiff, yDiff): Action {
  return {
    type: 'MOVE_WINDOW',
    windowId,
    xDiff,
    yDiff,
  };
}

export function resizeWindow(windowId, xDiff, yDiff): Action {
  return {
    type: 'RESIZE_WINDOW',
    windowId,
    xDiff,
    yDiff,
  };
}

export function closeAllWindowTypes(windowType: string): Action {
  return {
    type: 'CLOSE_ALL_WINDOW_TYPE',
    windowType,
  };
}

export function hideAllWindowTypes(
  windowType: string,
  hide: boolean,
): Action {
  return {
    type: 'HIDE_ALL_WINDOW_TYPE',
    windowType,
    hide,
  };
}

export function openChatWindow(): Action {
  return openWindow(
    'CHAT',
    '',
    false,
    true,
    { chatChannel: 1, inputMessage: '' },
    window.innerWidth - 350 - 62,
    window.innerHeight - 220 - 64,
    350,
    220,
  );
}

/*
 * query: Object with either userId: number or userName: string
 */
export function startDm(windowId, query): PromiseAction {
  return async (dispatch) => {
    dispatch(setApiFetching(true));
    const res = await requestStartDm(query);
    if (typeof res === 'string') {
      dispatch(sweetAlert(
        'Direct Message Error',
        res,
        'error',
        'OK',
      ));
    } else {
      const cid = Object.keys(res)[0];
      dispatch(addChatChannel(res));
      dispatch(setChatChannel(windowId, cid));
    }
    dispatch(setApiFetching(false));
  };
}

export function gotCoolDownDelta(delta: number) {
  return {
    type: 'COOLDOWN_DELTA',
    delta,
  };
}

export function setUserBlock(
  userId: number,
  userName: string,
  block: boolean,
) {
  return async (dispatch) => {
    dispatch(setApiFetching(true));
    const res = await requestBlock(userId, block);
    if (res) {
      dispatch(sweetAlert(
        'User Block Error',
        res,
        'error',
        'OK',
      ));
    } else if (block) {
      dispatch(blockUser(userId, userName));
    } else {
      dispatch(unblockUser(userId, userName));
    }
    dispatch(setApiFetching(false));
  };
}

export function setBlockingDm(
  block: boolean,
) {
  return async (dispatch) => {
    dispatch(setApiFetching(true));
    const res = await requestBlockDm(block);
    if (res) {
      dispatch(sweetAlert(
        'Blocking DMs Error',
        res,
        'error',
        'OK',
      ));
    } else {
      dispatch(blockingDm(block));
    }
    dispatch(setApiFetching(false));
  };
}

export function setLeaveChannel(
  cid: number,
) {
  return async (dispatch) => {
    dispatch(setApiFetching(true));
    const res = await requestLeaveChan(cid);
    if (res) {
      dispatch(sweetAlert(
        'Leaving Channel Error',
        res,
        'error',
        'OK',
      ));
    } else {
      dispatch(removeChatChannel(cid));
    }
    dispatch(setApiFetching(false));
  };
}

export function hideContextMenu(): Action {
  return {
    type: 'HIDE_CONTEXT_MENU',
  };
}

export function reloadUrl(): Action {
  return {
    type: 'RELOAD_URL',
  };
}

export function onViewFinishChange(): Action {
  return {
    type: 'ON_VIEW_FINISH_CHANGE',
  };
}

export function selectHistoricalTime(date: string, time: string) {
  return {
    type: 'SET_HISTORICAL_TIME',
    date,
    time,
  };
}

export function urlChange(): PromiseAction {
  return (dispatch) => {
    dispatch(reloadUrl());
  };
}
