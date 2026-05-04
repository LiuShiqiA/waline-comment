module.exports = () => async (ctx, next) => {
  const { oauthUrl } = think.config();
  const oauthResp = await fetch(oauthUrl, {
    method: 'GET',
    headers: {
      'user-agent': '@waline',
    },
  }).then((resp) => resp.json());

  if (!oauthResp || !Array.isArray(oauthResp.services)) {
    ctx.throw(502);
  }

  const allowed = process.env.OAUTH_PROVIDERS
    ? process.env.OAUTH_PROVIDERS.split(/\s*,\s*/)
    : null;

  ctx.state.oauthServices = allowed
    ? oauthResp.services.filter(({ name }) => allowed.includes(name))
    : oauthResp.services;

  await next();
};
