import { Reasonable } from "../etc/reasonable.ts";
import { GuildMemberPayload } from "../guilds/member.ts";
import { ComponentPayload } from "../interactions/components.ts";
import { ChannelType } from "./base.ts";
import { EmbedPayload } from "./embed.ts";
import { AllowedMentionsPayload } from "./etc.ts";
import { GuildTextChannelPayload } from "./guild.ts";
import { AttachmentPayload } from "./message.ts";

/** @link https://discord.com/developers/docs/resources/channel#thread-metadata-object-thread-metadata-structure */
export interface ThreadMetadataPayload {
  archived: boolean;
  auto_archive_duration: number;
  archive_timestamp: string;
  locked: boolean;
  invitable?: boolean;
}

/** @link https://discord.com/developers/docs/resources/channel#thread-member-object-thread-member-structure */
export interface ThreadMemberPayload {
  id?: string;
  user_id?: string;
  join_timestamp: string;
  flags: number;
  member?: GuildMemberPayload;
}

/** @link https://discord.com/developers/docs/resources/channel#channel-object-example-thread-channel */
export interface GuildThreadChannelPayload extends GuildTextChannelPayload {
  message_count: number;
  member_count: number;
  thread_metadata: ThreadMetadataPayload;
  member: ThreadMemberPayload;
  permissions: string;
  applied_tags?: string[];
}

// https://discord.com/developers/docs/resources/channel#modify-channel-json-params-thread
export interface EditGuildThreadChannelPayload extends Reasonable {
  name?: string;
  archived?: boolean;
  /** Duration in minute */
  auto_archive_duration?: number;
  locked?: boolean;
  invitable?: boolean;
  /** Duration in second */
  rate_limit_per_user?: number | null;
  flags?: number;
  applied_tags?: string[];
}

export interface StartThreadWithMessagePayload extends Reasonable {
  name: string;
  auto_archive_duration?: number;
}

export interface StartThreadWithoutMessagePayload extends Reasonable {
  name: string;
  auto_archive_duration?: number;
  type?: ChannelType;
  invitable?: boolean;
}

export interface ForumThreadMessageParams {
  content?: string;
  embeds?: EmbedPayload[];
  allowed_mentions?: AllowedMentionsPayload;
  components?: ComponentPayload[];
  sticker_ids?: string[];
  attachments?: AttachmentPayload[];
  flags?: number;
}

export interface StartThreadInForumChannelPayload extends Reasonable {
  name: string;
  auto_archive_duration?: number;
  rate_limit_per_user?: number | null;
  message: ForumThreadMessageParams;
  applied_tags?: string[];
}

export interface ListThreadsPayload {
  threads: GuildThreadChannelPayload[];
  members: ThreadMemberPayload[];
  has_more: boolean;
}

export interface ListThreadsParams {
  before?: string;
  limit?: number;
}

export type ListPublicArchivedThreadsPayload = ListThreadsPayload;
export type ListPublicArchivedThreadsParams = ListThreadsParams;
export type ListPrivateArchivedThreadsPayload = ListThreadsPayload;
export type ListPrivateArchivedThreadsParams = ListThreadsParams;
export type ListJoinedPrivateArchivedThreadsPayload = ListThreadsPayload;
export type ListJoinedPrivateArchivedThreadsParams = ListThreadsParams;