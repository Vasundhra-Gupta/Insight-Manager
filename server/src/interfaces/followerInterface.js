export class Ifollowers {
    async getFollowers(channelId) {
        throw new Error("method getFollowers is not overwritten");
    }

    async getFollowings(channelId) {
        throw new Error("method getFollowing is not overwritten");
    }

    async toggleFollow(userId, channelId) {
        throw new Error("method toggleFollow is not overwritten");
    }
}
