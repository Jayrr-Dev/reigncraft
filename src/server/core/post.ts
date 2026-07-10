import { context, reddit } from '@devvit/web/server';

type CreatePostOptions = {
  subredditName?: string;
  runAs?: 'APP' | 'USER';
};

export const resolvingCreatePostSubredditName = (
  subredditName?: string
): string => {
  const candidate = (subredditName ?? context.subredditName)?.replace(
    /^r\//,
    ''
  );
  if (!candidate || candidate === 'reigncraft') {
    return 'reigncraft_dev';
  }
  return candidate;
};

export const matchingSubmitLookupRacePostId = (
  error: unknown
): string | undefined => {
  if (!(error instanceof Error)) {
    return undefined;
  }

  const match = error.message.match(/^no post t3_([a-z0-9]+)$/i);
  return match?.[1];
};

const waitingForSubmittedPost = async (postId: string) => {
  const fullId = `t3_${postId}` as const;

  for (let attempt = 0; attempt < 5; attempt += 1) {
    await new Promise((resolve) => setTimeout(resolve, 500 * (attempt + 1)));

    try {
      return await reddit.getPostById(fullId);
    } catch {
      // Reddit may not return the post immediately after submit.
    }
  }

  throw new Error(`no post ${fullId}`);
};

const submittingCustomPost = async (options: CreatePostOptions) => {
  const subredditName = resolvingCreatePostSubredditName(options.subredditName);
  const common = {
    title: 'reigncraft',
    subredditName,
    entry: 'default',
    textFallback: { text: 'reigncraft' },
  };

  if (options.runAs === 'USER') {
    return await reddit.submitCustomPost({
      ...common,
      runAs: 'USER',
      userGeneratedContent: { text: 'reigncraft' },
    });
  }

  return await reddit.submitCustomPost(common);
};

export const createPost = async (options: CreatePostOptions = {}) => {
  try {
    return await submittingCustomPost(options);
  } catch (error) {
    const postId = matchingSubmitLookupRacePostId(error);
    if (!postId) {
      throw error;
    }

    return await waitingForSubmittedPost(postId);
  }
};
