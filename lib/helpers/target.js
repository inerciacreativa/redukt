/* globals REDUKT_TARGET */
/** Dynamically set absolute public path from current protocol and host */
if (REDUKT_TARGET) {
	__webpack_public_path__ = REDUKT_TARGET;
}
