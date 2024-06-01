import { ChannelType } from "../../../types/mod.ts";
import type {
  DMChannelPayload,
  GroupDMChannelPayload,
  GuildAnnouncementChannelPayload,
  GuildCategoryPayload,
  GuildForumChannelPayload,
  GuildStageChannelPayload,
  GuildTextChannelPayload,
  GuildVoiceChannelPayload,
} from "../../../types/mod.ts";
import type { Client } from "../client/mod.ts";
import { EveryChannelPayloads, EveryChannels } from "../../types/channel.ts";
import {
  DMChannel,
  GroupDMChannel,
  GuildAnnouncementChannel,
  GuildCategory,
  GuildForumChannel,
  GuildStageChannel,
  GuildTextChannel,
  GuildVoiceChannel,
} from "../structures/channels/mod.ts";

export const createChannel = <P extends EveryChannelPayloads>(
  client: Client,
  payload: P,
): EveryChannels => {
  switch (payload.type) {
    case ChannelType.GUILD_TEXT:
      return new GuildTextChannel(
        client,
        payload as GuildTextChannelPayload,
      );
    case ChannelType.DM:
      return new DMChannel(
        client,
        payload as DMChannelPayload,
      );
    case ChannelType.GUILD_VOICE:
      return new GuildVoiceChannel(
        client,
        payload as GuildVoiceChannelPayload,
      );
    case ChannelType.GROUP_DM:
      return new GroupDMChannel(
        client,
        payload as GroupDMChannelPayload,
      );
    case ChannelType.GUILD_CATEGORY:
      return new GuildCategory(
        client,
        payload as GuildCategoryPayload,
      );
    case ChannelType.GUILD_ANNOUNCEMENT:
      return new GuildAnnouncementChannel(
        client,
        payload as GuildAnnouncementChannelPayload,
      );
    // case ChannelType.ANNOUNCEMENT_THREAD:
    // case ChannelType.GUILD_PUBLIC_THREAD:
    // case ChannelType.GUILD_PRIVATE_THREAD:
    case ChannelType.GUILD_STAGE_VOICE:
      return new GuildStageChannel(
        client,
        payload as GuildStageChannelPayload,
      );
    // case ChannelType.GUILD_DIRECTORY:
    case ChannelType.GUILD_FORUM:
      return new GuildForumChannel(
        client,
        payload as GuildForumChannelPayload,
      );
    // case ChannelType.GUILD_MEDIA:
    default:
      // TODO: make a proper error type
      throw new Error("Unknown channel type");
  }
};