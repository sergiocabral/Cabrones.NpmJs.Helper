import { HttpStatusCode } from '../../../ts';

describe('Enum HttpStatusCode', () => {
  test('HttpStatusCode deve ter os valores convencionais', () => {
    // Arrange, Given
    // Act, When
    // Assert, Then

    expect(HttpStatusCode.Continue).toBe(100);
    expect(HttpStatusCode.SwitchingProtocols).toBe(101);
    expect(HttpStatusCode.Processing).toBe(102);
    expect(HttpStatusCode.OK).toBe(200);
    expect(HttpStatusCode.Created).toBe(201);
    expect(HttpStatusCode.Accepted).toBe(202);
    expect(HttpStatusCode.NonAauthoritativeInformation).toBe(203);
    expect(HttpStatusCode.NoContent).toBe(204);
    expect(HttpStatusCode.ResetContent).toBe(205);
    expect(HttpStatusCode.PartialContent).toBe(206);
    expect(HttpStatusCode.MultiStatus).toBe(207);
    expect(HttpStatusCode.AlreadyReported).toBe(208);
    expect(HttpStatusCode.IMUsed).toBe(226);
    expect(HttpStatusCode.MultipleChoices).toBe(300);
    expect(HttpStatusCode.MovedPermanently).toBe(301);
    expect(HttpStatusCode.Found).toBe(302);
    expect(HttpStatusCode.SeeOther).toBe(303);
    expect(HttpStatusCode.NotModified).toBe(304);
    expect(HttpStatusCode.UseProxy).toBe(305);
    expect(HttpStatusCode.TemporaryRedirect).toBe(307);
    expect(HttpStatusCode.PermanentRedirect).toBe(308);
    expect(HttpStatusCode.BadRequest).toBe(400);
    expect(HttpStatusCode.Unauthorized).toBe(401);
    expect(HttpStatusCode.PaymentRequired).toBe(402);
    expect(HttpStatusCode.Forbidden).toBe(403);
    expect(HttpStatusCode.NotFound).toBe(404);
    expect(HttpStatusCode.MethodNotAllowed).toBe(405);
    expect(HttpStatusCode.NotAcceptable).toBe(406);
    expect(HttpStatusCode.ProxyAuthenticationRequired).toBe(407);
    expect(HttpStatusCode.RequestTimeout).toBe(408);
    expect(HttpStatusCode.Conflict).toBe(409);
    expect(HttpStatusCode.Gone).toBe(410);
    expect(HttpStatusCode.LengthRequired).toBe(411);
    expect(HttpStatusCode.PreconditionFailed).toBe(412);
    expect(HttpStatusCode.PayloadTooLarge).toBe(413);
    expect(HttpStatusCode.RequestUriTooLong).toBe(414);
    expect(HttpStatusCode.UnsupportedMediaType).toBe(415);
    expect(HttpStatusCode.RequestedRangeNotSatisfiable).toBe(416);
    expect(HttpStatusCode.ExpectationFailed).toBe(417);
    expect(HttpStatusCode.IAmATeapot).toBe(418);
    expect(HttpStatusCode.MisdirectedRequest).toBe(421);
    expect(HttpStatusCode.UnprocessableEntity).toBe(422);
    expect(HttpStatusCode.Locked).toBe(423);
    expect(HttpStatusCode.FailedDependency).toBe(424);
    expect(HttpStatusCode.UpgradeRequired).toBe(426);
    expect(HttpStatusCode.PreconditionRequired).toBe(428);
    expect(HttpStatusCode.TooManyRequests).toBe(429);
    expect(HttpStatusCode.RequestHeaderFieldsTooLarge).toBe(431);
    expect(HttpStatusCode.ConnectionClosedWithoutResponse).toBe(444);
    expect(HttpStatusCode.UnavailableForLegalReasons).toBe(451);
    expect(HttpStatusCode.ClientClosedRequest).toBe(499);
    expect(HttpStatusCode.InternalServerError).toBe(500);
    expect(HttpStatusCode.NotImplemented).toBe(501);
    expect(HttpStatusCode.BadGateway).toBe(502);
    expect(HttpStatusCode.ServiceUnavailable).toBe(503);
    expect(HttpStatusCode.GatewayTimeout).toBe(504);
    expect(HttpStatusCode.HTTPVersionNotSupported).toBe(505);
    expect(HttpStatusCode.VariantAlsoNegociates).toBe(506);
    expect(HttpStatusCode.InsufficientStorage).toBe(507);
    expect(HttpStatusCode.LoopDetected).toBe(508);
    expect(HttpStatusCode.NotExtended).toBe(510);
    expect(HttpStatusCode.NetworkAuthenticationRequired).toBe(511);
    expect(HttpStatusCode.NetworkConnectionTimeoutError).toBe(599);
  });
});
