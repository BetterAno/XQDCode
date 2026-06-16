!(() => {
    const origin_log = console.log;
    ;
    // const origin_log = function () {};
    logToConsole = function () {
        return origin_log(...arguments)
        // return
    }
})();

watch = function (obj, name) {
    return new Proxy(obj, {
        get(target, p, receiver) {
            // 过滤没用的信息，不进行打印
            if (name)
                if (p === "Math" || p === "Symbol" || p === "Proxy" || p === "Promise" || p === "Array" || p === "isNaN" || p === "encodeURI" || p === "Uint8Array" || p.toString().indexOf("Symbol(") != -1 || p === "_element") {
                    var val = Reflect.get(...arguments);
                    return val
                } else {
                    var val = Reflect.get(...arguments);
                    const lst = []
                    for (let i = 0; i < p.length; i++) {
                        lst.push(p.charCodeAt(i))
                    }
                    if (typeof val === 'function') {
                        logToConsole(`取值: ${name}.${p} => function`);
                    } else {
                        logToConsole(`取值: ${name}.${p} =>`, val);
                    }

                    return val
                }
        },
        set(target, p, value, receiver) {
            var val = Reflect.set(...arguments)
            if (typeof value === 'function') {
                logToConsole(`设置值:${name}.${p} => function`,);
            } else {
                logToConsole(`设置值:${name}.${p} =>`, value);
                if (name === '环境数组' && p === '4') {
                    debugger
                }
            }
            return val
        },
        has(target, key) {
            logToConsole(`检查属性存在性: ${name}.${key.toString()}`);
            return key in target;
        },
        ownKeys(target) {
            logToConsole(`ownKeys检测: ${name}`);
            if (name === 'span_domtokenlist') {
                debugger
            }
            if (name === 'window') {
                const keys = [
                    "Object",
                    "Function",
                    "Array",
                    "Number",
                    "parseFloat",
                    "parseInt",
                    "Infinity",
                    "NaN",
                    "undefined",
                    "Boolean",
                    "String",
                    "Symbol",
                    "Date",
                    "Promise",
                    "RegExp",
                    "Error",
                    "AggregateError",
                    "EvalError",
                    "RangeError",
                    "ReferenceError",
                    "SyntaxError",
                    "TypeError",
                    "URIError",
                    "globalThis",
                    "JSON",
                    "Math",
                    "Intl",
                    "ArrayBuffer",
                    "Atomics",
                    "Uint8Array",
                    "Int8Array",
                    "Uint16Array",
                    "Int16Array",
                    "Uint32Array",
                    "Int32Array",
                    "BigUint64Array",
                    "BigInt64Array",
                    "Uint8ClampedArray",
                    "Float32Array",
                    "Float64Array",
                    "DataView",
                    "Map",
                    "BigInt",
                    "Set",
                    "WeakMap",
                    "WeakSet",
                    "Proxy",
                    "Reflect",
                    "FinalizationRegistry",
                    "WeakRef",
                    "decodeURI",
                    "decodeURIComponent",
                    "encodeURI",
                    "encodeURIComponent",
                    "escape",
                    "unescape",
                    "eval",
                    "isFinite",
                    "isNaN",
                    "console",
                    "Option",
                    "Image",
                    "Audio",
                    "webkitURL",
                    "webkitRTCPeerConnection",
                    "webkitMediaStream",
                    "WebKitMutationObserver",
                    "WebKitCSSMatrix",
                    "XSLTProcessor",
                    "XPathResult",
                    "XPathExpression",
                    "XPathEvaluator",
                    "XMLSerializer",
                    "XMLHttpRequestUpload",
                    "XMLHttpRequestEventTarget",
                    "XMLHttpRequest",
                    "XMLDocument",
                    "WritableStreamDefaultWriter",
                    "WritableStreamDefaultController",
                    "WritableStream",
                    "Worker",
                    "WindowControlsOverlayGeometryChangeEvent",
                    "WindowControlsOverlay",
                    "Window",
                    "WheelEvent",
                    "WebSocket",
                    "WebGLVertexArrayObject",
                    "WebGLUniformLocation",
                    "WebGLTransformFeedback",
                    "WebGLTexture",
                    "WebGLSync",
                    "WebGLShaderPrecisionFormat",
                    "WebGLShader",
                    "WebGLSampler",
                    "WebGLRenderingContext",
                    "WebGLRenderbuffer",
                    "WebGLQuery",
                    "WebGLProgram",
                    "WebGLObject",
                    "WebGLFramebuffer",
                    "WebGLContextEvent",
                    "WebGLBuffer",
                    "WebGLActiveInfo",
                    "WebGL2RenderingContext",
                    "WaveShaperNode",
                    "VisualViewport",
                    "VisibilityStateEntry",
                    "VirtualKeyboardGeometryChangeEvent",
                    "ViewTransitionTypeSet",
                    "ViewTransition",
                    "ViewTimeline",
                    "VideoPlaybackQuality",
                    "VideoFrame",
                    "VideoColorSpace",
                    "ValidityState",
                    "VTTCue",
                    "UserActivation",
                    "URLSearchParams",
                    "URLPattern",
                    "URL",
                    "UIEvent",
                    "TrustedTypePolicyFactory",
                    "TrustedTypePolicy",
                    "TrustedScriptURL",
                    "TrustedScript",
                    "TrustedHTML",
                    "TreeWalker",
                    "TransitionEvent",
                    "TransformStreamDefaultController",
                    "TransformStream",
                    "TrackEvent",
                    "TouchList",
                    "TouchEvent",
                    "Touch",
                    "ToggleEvent",
                    "TimeRanges",
                    "TextUpdateEvent",
                    "TextTrackList",
                    "TextTrackCueList",
                    "TextTrackCue",
                    "TextTrack",
                    "TextMetrics",
                    "TextFormatUpdateEvent",
                    "TextFormat",
                    "TextEvent",
                    "TextEncoderStream",
                    "TextEncoder",
                    "TextDecoderStream",
                    "TextDecoder",
                    "Text",
                    "TaskSignal",
                    "TaskPriorityChangeEvent",
                    "TaskController",
                    "TaskAttributionTiming",
                    "SyncManager",
                    "SubmitEvent",
                    "StyleSheetList",
                    "StyleSheet",
                    "StylePropertyMapReadOnly",
                    "StylePropertyMap",
                    "StorageEvent",
                    "Storage",
                    "StereoPannerNode",
                    "StaticRange",
                    "SourceBufferList",
                    "SourceBuffer",
                    "ShadowRoot",
                    "Selection",
                    "SecurityPolicyViolationEvent",
                    "ScrollTimeline",
                    "ScriptProcessorNode",
                    "ScreenOrientation",
                    "Screen",
                    "Scheduling",
                    "Scheduler",
                    "SVGViewElement",
                    "SVGUseElement",
                    "SVGUnitTypes",
                    "SVGTransformList",
                    "SVGTransform",
                    "SVGTitleElement",
                    "SVGTextPositioningElement",
                    "SVGTextPathElement",
                    "SVGTextElement",
                    "SVGTextContentElement",
                    "SVGTSpanElement",
                    "SVGSymbolElement",
                    "SVGSwitchElement",
                    "SVGStyleElement",
                    "SVGStringList",
                    "SVGStopElement",
                    "SVGSetElement",
                    "SVGScriptElement",
                    "SVGSVGElement",
                    "SVGRectElement",
                    "SVGRect",
                    "SVGRadialGradientElement",
                    "SVGPreserveAspectRatio",
                    "SVGPolylineElement",
                    "SVGPolygonElement",
                    "SVGPointList",
                    "SVGPoint",
                    "SVGPatternElement",
                    "SVGPathElement",
                    "SVGNumberList",
                    "SVGNumber",
                    "SVGMetadataElement",
                    "SVGMatrix",
                    "SVGMaskElement",
                    "SVGMarkerElement",
                    "SVGMPathElement",
                    "SVGLinearGradientElement",
                    "SVGLineElement",
                    "SVGLengthList",
                    "SVGLength",
                    "SVGImageElement",
                    "SVGGraphicsElement",
                    "SVGGradientElement",
                    "SVGGeometryElement",
                    "SVGGElement",
                    "SVGForeignObjectElement",
                    "SVGFilterElement",
                    "SVGFETurbulenceElement",
                    "SVGFETileElement",
                    "SVGFESpotLightElement",
                    "SVGFESpecularLightingElement",
                    "SVGFEPointLightElement",
                    "SVGFEOffsetElement",
                    "SVGFEMorphologyElement",
                    "SVGFEMergeNodeElement",
                    "SVGFEMergeElement",
                    "SVGFEImageElement",
                    "SVGFEGaussianBlurElement",
                    "SVGFEFuncRElement",
                    "SVGFEFuncGElement",
                    "SVGFEFuncBElement",
                    "SVGFEFuncAElement",
                    "SVGFEFloodElement",
                    "SVGFEDropShadowElement",
                    "SVGFEDistantLightElement",
                    "SVGFEDisplacementMapElement",
                    "SVGFEDiffuseLightingElement",
                    "SVGFEConvolveMatrixElement",
                    "SVGFECompositeElement",
                    "SVGFEComponentTransferElement",
                    "SVGFEColorMatrixElement",
                    "SVGFEBlendElement",
                    "SVGEllipseElement",
                    "SVGElement",
                    "SVGDescElement",
                    "SVGDefsElement",
                    "SVGComponentTransferFunctionElement",
                    "SVGClipPathElement",
                    "SVGCircleElement",
                    "SVGAnimationElement",
                    "SVGAnimatedTransformList",
                    "SVGAnimatedString",
                    "SVGAnimatedRect",
                    "SVGAnimatedPreserveAspectRatio",
                    "SVGAnimatedNumberList",
                    "SVGAnimatedNumber",
                    "SVGAnimatedLengthList",
                    "SVGAnimatedLength",
                    "SVGAnimatedInteger",
                    "SVGAnimatedEnumeration",
                    "SVGAnimatedBoolean",
                    "SVGAnimatedAngle",
                    "SVGAnimateTransformElement",
                    "SVGAnimateMotionElement",
                    "SVGAnimateElement",
                    "SVGAngle",
                    "SVGAElement",
                    "Response",
                    "ResizeObserverSize",
                    "ResizeObserverEntry",
                    "ResizeObserver",
                    "Request",
                    "ReportingObserver",
                    "ReportBody",
                    "ReadableStreamDefaultReader",
                    "ReadableStreamDefaultController",
                    "ReadableStreamBYOBRequest",
                    "ReadableStreamBYOBReader",
                    "ReadableStream",
                    "ReadableByteStreamController",
                    "Range",
                    "RadioNodeList",
                    "RTCTrackEvent",
                    "RTCStatsReport",
                    "RTCSessionDescription",
                    "RTCSctpTransport",
                    "RTCRtpTransceiver",
                    "RTCRtpSender",
                    "RTCRtpReceiver",
                    "RTCPeerConnectionIceEvent",
                    "RTCPeerConnectionIceErrorEvent",
                    "RTCPeerConnection",
                    "RTCIceTransport",
                    "RTCIceCandidate",
                    "RTCErrorEvent",
                    "RTCError",
                    "RTCEncodedVideoFrame",
                    "RTCEncodedAudioFrame",
                    "RTCDtlsTransport",
                    "RTCDataChannelEvent",
                    "RTCDTMFToneChangeEvent",
                    "RTCDTMFSender",
                    "RTCCertificate",
                    "PromiseRejectionEvent",
                    "ProgressEvent",
                    "Profiler",
                    "ProcessingInstruction",
                    "PopStateEvent",
                    "PointerEvent",
                    "PluginArray",
                    "Plugin",
                    "PictureInPictureWindow",
                    "PictureInPictureEvent",
                    "PeriodicWave",
                    "PerformanceTiming",
                    "PerformanceServerTiming",
                    "PerformanceScriptTiming",
                    "PerformanceResourceTiming",
                    "PerformancePaintTiming",
                    "PerformanceObserverEntryList",
                    "PerformanceObserver",
                    "PerformanceNavigationTiming",
                    "PerformanceNavigation",
                    "PerformanceMeasure",
                    "PerformanceMark",
                    "PerformanceLongTaskTiming",
                    "PerformanceLongAnimationFrameTiming",
                    "PerformanceEventTiming",
                    "PerformanceEntry",
                    "PerformanceElementTiming",
                    "Performance",
                    "Path2D",
                    "PannerNode",
                    "PageTransitionEvent",
                    "OverconstrainedError",
                    "OscillatorNode",
                    "OffscreenCanvasRenderingContext2D",
                    "OffscreenCanvas",
                    "OfflineAudioContext",
                    "OfflineAudioCompletionEvent",
                    "NodeList",
                    "NodeIterator",
                    "NodeFilter",
                    "Node",
                    "NetworkInformation",
                    "NavigatorUAData",
                    "Navigator",
                    "NavigationTransition",
                    "NavigationHistoryEntry",
                    "NavigationDestination",
                    "NavigationCurrentEntryChangeEvent",
                    "Navigation",
                    "NavigateEvent",
                    "NamedNodeMap",
                    "MutationRecord",
                    "MutationObserver",
                    "MouseEvent",
                    "MimeTypeArray",
                    "MimeType",
                    "MessagePort",
                    "MessageEvent",
                    "MessageChannel",
                    "MediaStreamTrackVideoStats",
                    "MediaStreamTrackProcessor",
                    "MediaStreamTrackGenerator",
                    "MediaStreamTrackEvent",
                    "MediaStreamTrackAudioStats",
                    "MediaStreamTrack",
                    "MediaStreamEvent",
                    "MediaStreamAudioSourceNode",
                    "MediaStreamAudioDestinationNode",
                    "MediaStream",
                    "MediaSourceHandle",
                    "MediaSource",
                    "MediaRecorder",
                    "MediaQueryListEvent",
                    "MediaQueryList",
                    "MediaList",
                    "MediaError",
                    "MediaEncryptedEvent",
                    "MediaElementAudioSourceNode",
                    "MediaCapabilities",
                    "MathMLElement",
                    "Location",
                    "LayoutShiftAttribution",
                    "LayoutShift",
                    "LargestContentfulPaint",
                    "KeyframeEffect",
                    "KeyboardEvent",
                    "IntersectionObserverEntry",
                    "IntersectionObserver",
                    "InputEvent",
                    "InputDeviceInfo",
                    "InputDeviceCapabilities",
                    "Ink",
                    "ImageData",
                    "ImageCapture",
                    "ImageBitmapRenderingContext",
                    "ImageBitmap",
                    "IdleDeadline",
                    "IIRFilterNode",
                    "IDBVersionChangeEvent",
                    "IDBTransaction",
                    "IDBRequest",
                    "IDBOpenDBRequest",
                    "IDBObjectStore",
                    "IDBKeyRange",
                    "IDBIndex",
                    "IDBFactory",
                    "IDBDatabase",
                    "IDBCursorWithValue",
                    "IDBCursor",
                    "History",
                    "HighlightRegistry",
                    "Highlight",
                    "Headers",
                    "HashChangeEvent",
                    "HTMLVideoElement",
                    "HTMLUnknownElement",
                    "HTMLUListElement",
                    "HTMLTrackElement",
                    "HTMLTitleElement",
                    "HTMLTimeElement",
                    "HTMLTextAreaElement",
                    "HTMLTemplateElement",
                    "HTMLTableSectionElement",
                    "HTMLTableRowElement",
                    "HTMLTableElement",
                    "HTMLTableColElement",
                    "HTMLTableCellElement",
                    "HTMLTableCaptionElement",
                    "HTMLStyleElement",
                    "HTMLSpanElement",
                    "HTMLSourceElement",
                    "HTMLSlotElement",
                    "HTMLSelectElement",
                    "HTMLScriptElement",
                    "HTMLQuoteElement",
                    "HTMLProgressElement",
                    "HTMLPreElement",
                    "HTMLPictureElement",
                    "HTMLParamElement",
                    "HTMLParagraphElement",
                    "HTMLOutputElement",
                    "HTMLOptionsCollection",
                    "HTMLOptionElement",
                    "HTMLOptGroupElement",
                    "HTMLObjectElement",
                    "HTMLOListElement",
                    "HTMLModElement",
                    "HTMLMeterElement",
                    "HTMLMetaElement",
                    "HTMLMenuElement",
                    "HTMLMediaElement",
                    "HTMLMarqueeElement",
                    "HTMLMapElement",
                    "HTMLLinkElement",
                    "HTMLLegendElement",
                    "HTMLLabelElement",
                    "HTMLLIElement",
                    "HTMLInputElement",
                    "HTMLImageElement",
                    "HTMLIFrameElement",
                    "HTMLHtmlElement",
                    "HTMLHeadingElement",
                    "HTMLHeadElement",
                    "HTMLHRElement",
                    "HTMLFrameSetElement",
                    "HTMLFrameElement",
                    "HTMLFormElement",
                    "HTMLFormControlsCollection",
                    "HTMLFontElement",
                    "HTMLFieldSetElement",
                    "HTMLEmbedElement",
                    "HTMLElement",
                    "HTMLDocument",
                    "HTMLDivElement",
                    "HTMLDirectoryElement",
                    "HTMLDialogElement",
                    "HTMLDetailsElement",
                    "HTMLDataListElement",
                    "HTMLDataElement",
                    "HTMLDListElement",
                    "HTMLCollection",
                    "HTMLCanvasElement",
                    "HTMLButtonElement",
                    "HTMLBodyElement",
                    "HTMLBaseElement",
                    "HTMLBRElement",
                    "HTMLAudioElement",
                    "HTMLAreaElement",
                    "HTMLAnchorElement",
                    "HTMLAllCollection",
                    "GeolocationPositionError",
                    "GeolocationPosition",
                    "GeolocationCoordinates",
                    "Geolocation",
                    "GamepadHapticActuator",
                    "GamepadEvent",
                    "GamepadButton",
                    "Gamepad",
                    "GainNode",
                    "FormDataEvent",
                    "FormData",
                    "FontFaceSetLoadEvent",
                    "FontFace",
                    "FocusEvent",
                    "FileReader",
                    "FileList",
                    "File",
                    "FeaturePolicy",
                    "External",
                    "EventTarget",
                    "EventSource",
                    "EventCounts",
                    "Event",
                    "ErrorEvent",
                    "EncodedVideoChunk",
                    "EncodedAudioChunk",
                    "ElementInternals",
                    "Element",
                    "EditContext",
                    "DynamicsCompressorNode",
                    "DragEvent",
                    "DocumentType",
                    "DocumentTimeline",
                    "DocumentFragment",
                    "Document",
                    "DelegatedInkTrailPresenter",
                    "DelayNode",
                    "DecompressionStream",
                    "DataTransferItemList",
                    "DataTransferItem",
                    "DataTransfer",
                    "DOMTokenList",
                    "DOMStringMap",
                    "DOMStringList",
                    "DOMRectReadOnly",
                    "DOMRectList",
                    "DOMRect",
                    "DOMQuad",
                    "DOMPointReadOnly",
                    "DOMPoint",
                    "DOMParser",
                    "DOMMatrixReadOnly",
                    "DOMMatrix",
                    "DOMImplementation",
                    "DOMException",
                    "DOMError",
                    "CustomStateSet",
                    "CustomEvent",
                    "CustomElementRegistry",
                    "Crypto",
                    "CountQueuingStrategy",
                    "ConvolverNode",
                    "ContentVisibilityAutoStateChangeEvent",
                    "ConstantSourceNode",
                    "CompressionStream",
                    "CompositionEvent",
                    "Comment",
                    "CloseWatcher",
                    "CloseEvent",
                    "ClipboardEvent",
                    "CharacterData",
                    "CharacterBoundsUpdateEvent",
                    "ChannelSplitterNode",
                    "ChannelMergerNode",
                    "CanvasRenderingContext2D",
                    "CanvasPattern",
                    "CanvasGradient",
                    "CanvasCaptureMediaStreamTrack",
                    "CSSVariableReferenceValue",
                    "CSSUnparsedValue",
                    "CSSUnitValue",
                    "CSSTranslate",
                    "CSSTransition",
                    "CSSTransformValue",
                    "CSSTransformComponent",
                    "CSSSupportsRule",
                    "CSSStyleValue",
                    "CSSStyleSheet",
                    "CSSStyleRule",
                    "CSSStyleDeclaration",
                    "CSSStartingStyleRule",
                    "CSSSkewY",
                    "CSSSkewX",
                    "CSSSkew",
                    "CSSScopeRule",
                    "CSSScale",
                    "CSSRuleList",
                    "CSSRule",
                    "CSSRotate",
                    "CSSPropertyRule",
                    "CSSPositionValue",
                    "CSSPositionTryRule",
                    "CSSPositionTryDescriptors",
                    "CSSPerspective",
                    "CSSPageRule",
                    "CSSNumericValue",
                    "CSSNumericArray",
                    "CSSNestedDeclarations",
                    "CSSNamespaceRule",
                    "CSSMediaRule",
                    "CSSMatrixComponent",
                    "CSSMathValue",
                    "CSSMathSum",
                    "CSSMathProduct",
                    "CSSMathNegate",
                    "CSSMathMin",
                    "CSSMathMax",
                    "CSSMathInvert",
                    "CSSMathClamp",
                    "CSSLayerStatementRule",
                    "CSSLayerBlockRule",
                    "CSSKeywordValue",
                    "CSSKeyframesRule",
                    "CSSKeyframeRule",
                    "CSSImportRule",
                    "CSSImageValue",
                    "CSSGroupingRule",
                    "CSSFontPaletteValuesRule",
                    "CSSFontFaceRule",
                    "CSSCounterStyleRule",
                    "CSSContainerRule",
                    "CSSConditionRule",
                    "CSSAnimation",
                    "CSS",
                    "CSPViolationReportBody",
                    "CDATASection",
                    "ByteLengthQueuingStrategy",
                    "BrowserCaptureMediaStreamTrack",
                    "BroadcastChannel",
                    "BlobEvent",
                    "Blob",
                    "BiquadFilterNode",
                    "BeforeUnloadEvent",
                    "BeforeInstallPromptEvent",
                    "BaseAudioContext",
                    "BarProp",
                    "AudioWorkletNode",
                    "AudioSinkInfo",
                    "AudioScheduledSourceNode",
                    "AudioProcessingEvent",
                    "AudioParamMap",
                    "AudioParam",
                    "AudioNode",
                    "AudioListener",
                    "AudioDestinationNode",
                    "AudioData",
                    "AudioContext",
                    "AudioBufferSourceNode",
                    "AudioBuffer",
                    "Attr",
                    "AnimationTimeline",
                    "AnimationPlaybackEvent",
                    "AnimationEvent",
                    "AnimationEffect",
                    "Animation",
                    "AnalyserNode",
                    "AbstractRange",
                    "AbortSignal",
                    "AbortController",
                    "window",
                    "self",
                    "document",
                    "name",
                    "location",
                    "customElements",
                    "history",
                    "navigation",
                    "locationbar",
                    "menubar",
                    "personalbar",
                    "scrollbars",
                    "statusbar",
                    "toolbar",
                    "status",
                    "closed",
                    "frames",
                    "length",
                    "top",
                    "opener",
                    "parent",
                    "frameElement",
                    "navigator",
                    "origin",
                    "external",
                    "screen",
                    "innerWidth",
                    "innerHeight",
                    "scrollX",
                    "pageXOffset",
                    "scrollY",
                    "pageYOffset",
                    "visualViewport",
                    "screenX",
                    "screenY",
                    "outerWidth",
                    "outerHeight",
                    "devicePixelRatio",
                    "event",
                    "clientInformation",
                    "offscreenBuffering",
                    "screenLeft",
                    "screenTop",
                    "styleMedia",
                    "onsearch",
                    "trustedTypes",
                    "performance",
                    "onappinstalled",
                    "onbeforeinstallprompt",
                    "crypto",
                    "indexedDB",
                    "sessionStorage",
                    "localStorage",
                    "onbeforexrselect",
                    "onabort",
                    "onbeforeinput",
                    "onbeforematch",
                    "onbeforetoggle",
                    "onblur",
                    "oncancel",
                    "oncanplay",
                    "oncanplaythrough",
                    "onchange",
                    "onclick",
                    "onclose",
                    "oncontentvisibilityautostatechange",
                    "oncontextlost",
                    "oncontextmenu",
                    "oncontextrestored",
                    "oncuechange",
                    "ondblclick",
                    "ondrag",
                    "ondragend",
                    "ondragenter",
                    "ondragleave",
                    "ondragover",
                    "ondragstart",
                    "ondrop",
                    "ondurationchange",
                    "onemptied",
                    "onended",
                    "onerror",
                    "onfocus",
                    "onformdata",
                    "oninput",
                    "oninvalid",
                    "onkeydown",
                    "onkeypress",
                    "onkeyup",
                    "onload",
                    "onloadeddata",
                    "onloadedmetadata",
                    "onloadstart",
                    "onmousedown",
                    "onmouseenter",
                    "onmouseleave",
                    "onmousemove",
                    "onmouseout",
                    "onmouseover",
                    "onmouseup",
                    "onmousewheel",
                    "onpause",
                    "onplay",
                    "onplaying",
                    "onprogress",
                    "onratechange",
                    "onreset",
                    "onresize",
                    "onscroll",
                    "onsecuritypolicyviolation",
                    "onseeked",
                    "onseeking",
                    "onselect",
                    "onslotchange",
                    "onstalled",
                    "onsubmit",
                    "onsuspend",
                    "ontimeupdate",
                    "ontoggle",
                    "onvolumechange",
                    "onwaiting",
                    "onwebkitanimationend",
                    "onwebkitanimationiteration",
                    "onwebkitanimationstart",
                    "onwebkittransitionend",
                    "onwheel",
                    "onauxclick",
                    "ongotpointercapture",
                    "onlostpointercapture",
                    "onpointerdown",
                    "onpointermove",
                    "onpointerrawupdate",
                    "onpointerup",
                    "onpointercancel",
                    "onpointerover",
                    "onpointerout",
                    "onpointerenter",
                    "onpointerleave",
                    "onselectstart",
                    "onselectionchange",
                    "onanimationend",
                    "onanimationiteration",
                    "onanimationstart",
                    "ontransitionrun",
                    "ontransitionstart",
                    "ontransitionend",
                    "ontransitioncancel",
                    "onafterprint",
                    "onbeforeprint",
                    "onbeforeunload",
                    "onhashchange",
                    "onlanguagechange",
                    "onmessage",
                    "onmessageerror",
                    "onoffline",
                    "ononline",
                    "onpagehide",
                    "onpageshow",
                    "onpopstate",
                    "onrejectionhandled",
                    "onstorage",
                    "onunhandledrejection",
                    "onunload",
                    "isSecureContext",
                    "crossOriginIsolated",
                    "scheduler",
                    "alert",
                    "atob",
                    "blur",
                    "btoa",
                    "cancelAnimationFrame",
                    "cancelIdleCallback",
                    "captureEvents",
                    "clearInterval",
                    "clearTimeout",
                    "close",
                    "confirm",
                    "createImageBitmap",
                    "fetch",
                    "find",
                    "focus",
                    "getComputedStyle",
                    "getSelection",
                    "matchMedia",
                    "moveBy",
                    "moveTo",
                    "open",
                    "postMessage",
                    "print",
                    "prompt",
                    "queueMicrotask",
                    "releaseEvents",
                    "reportError",
                    "requestAnimationFrame",
                    "requestIdleCallback",
                    "resizeBy",
                    "resizeTo",
                    "scroll",
                    "scrollBy",
                    "scrollTo",
                    "setInterval",
                    "setTimeout",
                    "stop",
                    "structuredClone",
                    "webkitCancelAnimationFrame",
                    "webkitRequestAnimationFrame",
                    "Iterator",
                    "chrome",
                    "WebAssembly",
                    "caches",
                    "cookieStore",
                    "ondevicemotion",
                    "ondeviceorientation",
                    "ondeviceorientationabsolute",
                    "launchQueue",
                    "sharedStorage",
                    "documentPictureInPicture",
                    "AICreateMonitor",
                    "AbsoluteOrientationSensor",
                    "Accelerometer",
                    "AudioDecoder",
                    "AudioEncoder",
                    "AudioWorklet",
                    "BatteryManager",
                    "Cache",
                    "CacheStorage",
                    "Clipboard",
                    "ClipboardItem",
                    "CookieChangeEvent",
                    "CookieStore",
                    "CookieStoreManager",
                    "Credential",
                    "CredentialsContainer",
                    "CryptoKey",
                    "DeviceMotionEvent",
                    "DeviceMotionEventAcceleration",
                    "DeviceMotionEventRotationRate",
                    "DeviceOrientationEvent",
                    "FederatedCredential",
                    "GPU",
                    "GPUAdapter",
                    "GPUAdapterInfo",
                    "GPUBindGroup",
                    "GPUBindGroupLayout",
                    "GPUBuffer",
                    "GPUBufferUsage",
                    "GPUCanvasContext",
                    "GPUColorWrite",
                    "GPUCommandBuffer",
                    "GPUCommandEncoder",
                    "GPUCompilationInfo",
                    "GPUCompilationMessage",
                    "GPUComputePassEncoder",
                    "GPUComputePipeline",
                    "GPUDevice",
                    "GPUDeviceLostInfo",
                    "GPUError",
                    "GPUExternalTexture",
                    "GPUInternalError",
                    "GPUMapMode",
                    "GPUOutOfMemoryError",
                    "GPUPipelineError",
                    "GPUPipelineLayout",
                    "GPUQuerySet",
                    "GPUQueue",
                    "GPURenderBundle",
                    "GPURenderBundleEncoder",
                    "GPURenderPassEncoder",
                    "GPURenderPipeline",
                    "GPUSampler",
                    "GPUShaderModule",
                    "GPUShaderStage",
                    "GPUSupportedFeatures",
                    "GPUSupportedLimits",
                    "GPUTexture",
                    "GPUTextureUsage",
                    "GPUTextureView",
                    "GPUUncapturedErrorEvent",
                    "GPUValidationError",
                    "GravitySensor",
                    "Gyroscope",
                    "IdleDetector",
                    "ImageDecoder",
                    "ImageTrack",
                    "ImageTrackList",
                    "Keyboard",
                    "KeyboardLayoutMap",
                    "LinearAccelerationSensor",
                    "MIDIAccess",
                    "MIDIConnectionEvent",
                    "MIDIInput",
                    "MIDIInputMap",
                    "MIDIMessageEvent",
                    "MIDIOutput",
                    "MIDIOutputMap",
                    "MIDIPort",
                    "MediaDeviceInfo",
                    "MediaDevices",
                    "MediaKeyMessageEvent",
                    "MediaKeySession",
                    "MediaKeyStatusMap",
                    "MediaKeySystemAccess",
                    "MediaKeys",
                    "NavigationPreloadManager",
                    "NavigatorManagedData",
                    "OrientationSensor",
                    "PasswordCredential",
                    "ProtectedAudience",
                    "RelativeOrientationSensor",
                    "ScreenDetailed",
                    "ScreenDetails",
                    "Sensor",
                    "SensorErrorEvent",
                    "ServiceWorker",
                    "ServiceWorkerContainer",
                    "ServiceWorkerRegistration",
                    "StorageManager",
                    "SubtleCrypto",
                    "VideoDecoder",
                    "VideoEncoder",
                    "VirtualKeyboard",
                    "WGSLLanguageFeatures",
                    "WebTransport",
                    "WebTransportBidirectionalStream",
                    "WebTransportDatagramDuplexStream",
                    "WebTransportError",
                    "Worklet",
                    "XRDOMOverlayState",
                    "XRLayer",
                    "XRWebGLBinding",
                    "AuthenticatorAssertionResponse",
                    "AuthenticatorAttestationResponse",
                    "AuthenticatorResponse",
                    "PublicKeyCredential",
                    "Bluetooth",
                    "BluetoothCharacteristicProperties",
                    "BluetoothDevice",
                    "BluetoothRemoteGATTCharacteristic",
                    "BluetoothRemoteGATTDescriptor",
                    "BluetoothRemoteGATTServer",
                    "BluetoothRemoteGATTService",
                    "CaptureController",
                    "DevicePosture",
                    "DocumentPictureInPicture",
                    "EyeDropper",
                    "FileSystemDirectoryHandle",
                    "FileSystemFileHandle",
                    "FileSystemHandle",
                    "FileSystemWritableFileStream",
                    "FileSystemObserver",
                    "FontData",
                    "FragmentDirective",
                    "HID",
                    "HIDConnectionEvent",
                    "HIDDevice",
                    "HIDInputReportEvent",
                    "IdentityCredential",
                    "IdentityProvider",
                    "IdentityCredentialError",
                    "LaunchParams",
                    "LaunchQueue",
                    "Lock",
                    "LockManager",
                    "NavigatorLogin",
                    "NotRestoredReasonDetails",
                    "NotRestoredReasons",
                    "OTPCredential",
                    "PaymentAddress",
                    "PaymentRequest",
                    "PaymentRequestUpdateEvent",
                    "PaymentResponse",
                    "PaymentManager",
                    "PaymentMethodChangeEvent",
                    "Presentation",
                    "PresentationAvailability",
                    "PresentationConnection",
                    "PresentationConnectionAvailableEvent",
                    "PresentationConnectionCloseEvent",
                    "PresentationConnectionList",
                    "PresentationReceiver",
                    "PresentationRequest",
                    "PressureObserver",
                    "PressureRecord",
                    "Serial",
                    "SerialPort",
                    "StorageBucket",
                    "StorageBucketManager",
                    "USB",
                    "USBAlternateInterface",
                    "USBConfiguration",
                    "USBConnectionEvent",
                    "USBDevice",
                    "USBEndpoint",
                    "USBInTransferResult",
                    "USBInterface",
                    "USBIsochronousInTransferPacket",
                    "USBIsochronousInTransferResult",
                    "USBIsochronousOutTransferPacket",
                    "USBIsochronousOutTransferResult",
                    "USBOutTransferResult",
                    "WakeLock",
                    "WakeLockSentinel",
                    "XRAnchor",
                    "XRAnchorSet",
                    "XRBoundedReferenceSpace",
                    "XRCPUDepthInformation",
                    "XRCamera",
                    "XRDepthInformation",
                    "XRFrame",
                    "XRHitTestResult",
                    "XRHitTestSource",
                    "XRInputSource",
                    "XRInputSourceArray",
                    "XRInputSourceEvent",
                    "XRInputSourcesChangeEvent",
                    "XRLightEstimate",
                    "XRLightProbe",
                    "XRPose",
                    "XRRay",
                    "XRReferenceSpace",
                    "XRReferenceSpaceEvent",
                    "XRRenderState",
                    "XRRigidTransform",
                    "XRSession",
                    "XRSessionEvent",
                    "XRSpace",
                    "XRSystem",
                    "XRTransientInputHitTestResult",
                    "XRTransientInputHitTestSource",
                    "XRView",
                    "XRViewerPose",
                    "XRViewport",
                    "XRWebGLDepthInformation",
                    "XRWebGLLayer",
                    "XRHand",
                    "XRJointPose",
                    "XRJointSpace",
                    "getScreenDetails",
                    "queryLocalFonts",
                    "showDirectoryPicker",
                    "showOpenFilePicker",
                    "showSaveFilePicker",
                    "originAgentCluster",
                    "onpageswap",
                    "onpagereveal",
                    "credentialless",
                    "fence",
                    "speechSynthesis",
                    "onscrollend",
                    "onscrollsnapchange",
                    "onscrollsnapchanging",
                    "BackgroundFetchManager",
                    "BackgroundFetchRecord",
                    "BackgroundFetchRegistration",
                    "BluetoothUUID",
                    "CSSMarginRule",
                    "CSSViewTransitionRule",
                    "CaretPosition",
                    "ChapterInformation",
                    "CropTarget",
                    "DocumentPictureInPictureEvent",
                    "Fence",
                    "FencedFrameConfig",
                    "HTMLFencedFrameElement",
                    "MediaMetadata",
                    "MediaSession",
                    "NavigationActivation",
                    "Notification",
                    "PageRevealEvent",
                    "PageSwapEvent",
                    "PeriodicSyncManager",
                    "PermissionStatus",
                    "Permissions",
                    "PushManager",
                    "PushSubscription",
                    "PushSubscriptionOptions",
                    "RTCDataChannel",
                    "RemotePlayback",
                    "RestrictionTarget",
                    "SharedStorage",
                    "SharedStorageWorklet",
                    "SharedWorker",
                    "SnapEvent",
                    "SpeechSynthesis",
                    "SpeechSynthesisErrorEvent",
                    "SpeechSynthesisEvent",
                    "SpeechSynthesisUtterance",
                    "SpeechSynthesisVoice",
                    "WebSocketError",
                    "WebSocketStream",
                    "webkitSpeechGrammar",
                    "webkitSpeechGrammarList",
                    "webkitSpeechRecognition",
                    "webkitSpeechRecognitionError",
                    "webkitSpeechRecognitionEvent",
                    "webkitRequestFileSystem",
                    "webkitResolveLocalFileSystemURL",
                    "PC_ITEM_CONFIG",
                    "dra",
                    "customPointEvent",
                    "_risk_xhr",
                    "__intercept__fetch__",
                    "atobFill",
                    "riskHandlerUtil",
                    "ParamsSign",
                    "__core-js_shared__",
                    "regeneratorRuntime",
                    "callbackName",
                    "ajaxCount",
                    "__JDWEBSIGNHELPER_$DATA__",
                    "PSign",
                    "SHA256",
                    "bp_bizid",
                    "_0x26e2b7",
                    "_riskFpMode",
                    "jdtRiskContext",
                    "collectConfig",
                    "jdtRiskUtil",
                    "jdtRiskEncryptUtil",
                    "JdtRiskFingerPrint",
                    "jdtRiskCookieManager",
                    "jdtLocalStorageManager",
                    "jdtRiskStorageManager",
                    "TDEnvCollector",
                    "__getTkResult",
                    "_0x37f5",
                    "__callbackWrapper",
                    "reportLog",
                    "_0x1d73",
                    "_globalState",
                    "getJsToken",
                    "getJdEid",
                    "pageConfig",
                    "is_sort_black_list",
                    "jump_mobile",
                    "apiHost",
                    "commonAppId",
                    "preloadArray",
                    "seajsConfig",
                    "login",
                    "regist",
                    "createCookie",
                    "readCookie",
                    "addToFavorite",
                    "TrimPath",
                    "$",
                    "jQuery",
                    "seajs",
                    "define",
                    "EventEmitterPcItem",
                    "itemEventBus",
                    "listenTabVisibileReport",
                    "totouchbate",
                    "hashTag",
                    "href",
                    "_0x3db2",
                    "_0x3575",
                    "ParamsSignMain"
                ]
                if (!keys.includes('$jsDebugIsRegistered')) {
                    keys.push('$jsDebugIsRegistered');
                }
                return keys
            }
            if (name === 'document') {
                return [
                    "location"
                ]
            }
            if (name === 'window' || name === 'document') debugger;
            return Reflect.ownKeys(...arguments)
        }
    })
}
const safeFunction = (function () {
    let initialized = false;
    let myFunction_toString_symbol;

    const set_native = function set_native(func, key, value) {
        Object.defineProperty(func, key, {
            "enumerable": false,
            "configurable": true,
            "writable": true,
            "value": value
        });
    };

    return function safeFunction(func) {
        if (!initialized) {
            Function.prototype.$call = Function.prototype.call;
            const $toString = Function.toString;
            myFunction_toString_symbol = Symbol('functionToString');

            const myToString = function myToString() {
                return typeof this === 'function' && this[myFunction_toString_symbol] || $toString.$call(this);
            };

            delete Function.prototype.toString;
            set_native(Function.prototype, "toString", myToString);
            set_native(Function.prototype.toString, myFunction_toString_symbol, "function toString() { [native code] }");

            initialized = true;
        }
        // 避免重复添加
        if (!func.hasOwnProperty(myFunction_toString_symbol)) {
            set_native(func, myFunction_toString_symbol, `function ${func.name || ''}() { [native code] }`);
        }

        return func;
    };
})();
const CONSTRUCTOR_TOKEN = "constructor_token";

function createConstructor(constructorName, enableStrictMode, propertiesList = [], prototypeMethods = {}, parentConstructorName = null) {
    const instancesData = {};

    // 创建有名称的构造函数
    const constructorFunction = function (element, propertySetter, validationToken) {
        // 验证逻辑
        if (enableStrictMode && !(validationToken && validationToken === CONSTRUCTOR_TOKEN)) {
            throw new Error("Illegal constructor");
        }

        if (parentConstructorName && window[parentConstructorName]) {
            window[parentConstructorName].call(this, element, null, CONSTRUCTOR_TOKEN);
        }

        if (propertySetter && typeof propertySetter === "function") {
            propertySetter(this);
        }

        const instanceProperties = element && typeof element === "object" ? {...element} : {};
        this._element = Symbol('_element');
        instancesData[this._element] = instanceProperties;

        if (element && typeof element === "object") {
            Object.keys(element).forEach(key => {
                if (!this[key]) {
                    this[key] = element[key];
                }
            });
        }

        // 修改 propertiesList 格式，支持指定属性所属的类
        propertiesList.forEach(prop => {
            if (prop.name && 'value' in prop) {
                // 如果指定了 targetClass，则尝试在指定的类上设置属性
                let targetPrototype = constructorFunction.prototype;

                if (prop.targetClass && window[prop.targetClass]) {
                    targetPrototype = window[prop.targetClass].prototype;
                }

                Object.defineProperty(targetPrototype, prop.name, {
                    value: prop.value,
                    writable: prop.writable !== undefined ? prop.writable : false,
                    enumerable: prop.enumerable !== undefined ? prop.enumerable : true,
                    configurable: prop.configurable !== undefined ? prop.configurable : true
                });
            }
        });
    };

    // 设置函数名
    Object.defineProperty(constructorFunction, 'name', {
        value: constructorName,
        writable: false,
        enumerable: false,
        configurable: true
    });

    // 设置继承关系
    if (parentConstructorName && window[parentConstructorName]) {
        constructorFunction.prototype = Object.create(window[parentConstructorName].prototype);
        constructorFunction.prototype.constructor = constructorFunction;
        Object.setPrototypeOf(constructorFunction, window[parentConstructorName]);
    }

    // 设置toStringTag
    Object.defineProperty(constructorFunction.prototype, Symbol.toStringTag, {
        value: constructorName,
        writable: false,
        enumerable: false,
        configurable: true
    });

    // 添加原型方法
    Object.keys(prototypeMethods).forEach(methodName => {
        constructorFunction.prototype[methodName] = prototypeMethods[methodName];
        if (typeof constructorFunction.prototype[methodName] === "function") {
            safeFunction(constructorFunction.prototype[methodName]);
        }
    });

    // 保护构造函数
    safeFunction(constructorFunction);

    // 将构造函数挂载到全局对象
    window[constructorName] = constructorFunction;

    return constructorFunction;
}

/* 补环境 */
window = globalThis;

createConstructor("EventTarget", true, [], {
    addEventListener: function (type, listener) {
        console.log('window.addEventListener方法获取的参数:', arguments);
    }
}, {})
// 无需补 WindowProperties, 浏览器渲染的, 与JS代码无关
createConstructor('Window', true, [], {}, "EventTarget")
Object.setPrototypeOf(window, Window.prototype);

window.sessionStorage = {
    "3AB9D23F7A4B3CSS": "jdd0367P6V6ERJ6TXLFOJ5DEMV4GCIM2HDNPIP2U3KXMX5ELXD6L3K5WAUT4CQM3PUUVXN4JI5CR5KQQY5VW7EOI37AW7DQAAAAM3JC5MODQAAAAACIIW3T3I5RHONMX",
    "3AB9D23F7A4B3C9B": "67P6V6ERJ6TXLFOJ5DEMV4GCIM2HDNPIP2U3KXMX5ELXD6L3K5WAUT4CQM3PUUVXN4JI5CR5KQQY5VW7EOI37AW7DQ",
    "PCA9D23F7A4B3CSS": "307786bbd011d8ede56d7f417b45e7b3",
    "shshshfpb": "BApXW4keyS_5AK1xG9dI3EXQZvXYzZQH7BiQAF7pp9xJ1MuVwVI-28XS9j3n-NYNycONZ5PffhNqaUQk",
    "CA1AN5BV0CA8DS2EPC": "0a935ac7a52197952d9e70a4b023bb1d",
    "_Router_Block": "proManagerRouter",
    "shshshfpx": "e4ddf256-0795-d9a5-c6d0-d40188a3b021-1766411095",
    "_StationManager_Path": "/proManager/index",
    "shshshfpa": "e4ddf256-0795-d9a5-c6d0-d40188a3b021-1766411095",
    "_Router_Name": "[\"我的推广\",\"我要推广\",\"商品推广\"]"
}
window.localStorage = {
    "dra_union_device": "a1843c38-9604-4815-8b42-06c29d28cb0f",
    "JDst_rac_nfd": "{\"v\":10,\"t\":1766455307693,\"e\":31536000}",
    "hf_time": "1766469760148",
    "__we_m_gl__": "ZnAlM0FmNjQwNTBkOGQ2Mjc2MzZiYzgwMmFmMTJmMjY2NWI5OX52ZW5kb3IlM0FXZWJLaXR+dmVyc2lvbiUzQVdlYkdMJTIwMS4wJTIwKE9wZW5HTCUyMEVTJTIwMi4wJTIwQ2hyb21pdW0pfnVubWFza2VkJTIwdmVuZG9yJTNBR29vZ2xlJTIwSW5jLiUyMChNaWNyb3NvZnQpfnVubWFza2VkJTIwcmVuZGVyZXIlM0FBTkdMRSUyMChNaWNyb3NvZnQlMkMlMjBNaWNyb3NvZnQlMjBCYXNpYyUyMFJlbmRlciUyMERyaXZlciUyMCgweDAwMDAwMDhDKSUyMERpcmVjdDNEMTElMjB2c181XzAlMjBwc181XzAlMkMlMjBEM0QxMSk=",
    "batchData": "{}",
    "UNION_ROLES": "{\"appAgree\":0,\"calendar\":0,\"cpActivity\":0,\"cpcAgree\":0,\"cpsAgree\":0,\"isCeleShop\":0,\"isContent\":0,\"isOperate\":0,\"isGK\":0,\"isMotherPower\":0,\"userTask\":0,\"isChannel\":0,\"qualificationStatus\":null,\"register\":0,\"nickName\":\"\",\"yunBigImageUrl\":\"\"}",
    "WQ_gather_cv1": "{\"v\":\"c06fd393659321ee8f23eb11164ac02d\",\"t\":1766455306927,\"e\":31536000}",
    "loglevel": "SILENT",
    "3AB9D23F7A4B3CSS": "jdd0367P6V6ERJ6TXLFOJ5DEMV4GCIM2HDNPIP2U3KXMX5ELXD6L3K5WAUT4CQM3PUUVXN4JI5CR5KQQY5VW7EOI37AW7DQAAAAM3JC5MODQAAAAACIIW3T3I5RHONMX",
    "3AB9D23F7A4B3C9B": "67P6V6ERJ6TXLFOJ5DEMV4GCIM2HDNPIP2U3KXMX5ELXD6L3K5WAUT4CQM3PUUVXN4JI5CR5KQQY5VW7EOI37AW7DQ",
    "CA1AN5BV0CA8DS2EPC": "0a935ac7a52197952d9e70a4b023bb1d",
    "__disp_m_gr__": "0",
    "WQ_dy1_vk": "{\"5.2\":{\"73806\":{\"e\":31536000,\"v\":\"izam9gw3tt0pwt62\",\"t\":1766411095320},\"586ae\":{\"e\":31536000,\"v\":\"gigt63zmaj3qjh32\",\"t\":1766411095369}}}",
    "JDst_rac_last_update": "{\"v\":1766455306825}",
    "msgVisiblePop": "false",
    "WQ_gather_wgl1": "{\"v\":\"635d057522a8736cc26d94b200e44627\",\"t\":1766455306927,\"e\":31536000}",
    "__we_m_ft__": "QXJpYWwlMkNBcmlhbCUyMEJsYWNrJTJDQXJpYWwlMjBOYXJyb3clMkNBcmlhbCUyMFVuaWNvZGUlMjBNUyUyQ0Jvb2slMjBBbnRpcXVhJTJDQm9va21hbiUyME9sZCUyMFN0eWxlJTJDQ2FsaWJyaSUyQ0NhbWJyaWElMkNDYW1icmlhJTIwTWF0aCUyQ0NlbnR1cnklMkNDZW50dXJ5JTIwR290aGljJTJDQ2VudHVyeSUyMFNjaG9vbGJvb2slMkNDb21pYyUyMFNhbnMlMjBNUyUyQ0NvbnNvbGFzJTJDQ291cmllciUyQ0NvdXJpZXIlMjBOZXclMkNHYXJhbW9uZCUyQ0dlb3JnaWElMkNIZWx2ZXRpY2ElMkNJbXBhY3QlMkNMdWNpZGElMjBCcmlnaHQlMkNMdWNpZGElMjBDYWxsaWdyYXBoeSUyQ0x1Y2lkYSUyMENvbnNvbGUlMkNMdWNpZGElMjBGYXglMkNMdWNpZGElMjBIYW5kd3JpdGluZyUyQ0x1Y2lkYSUyMFNhbnMlMkNMdWNpZGElMjBTYW5zJTIwVHlwZXdyaXRlciUyQ0x1Y2lkYSUyMFNhbnMlMjBVbmljb2RlJTJDTWljcm9zb2Z0JTIwU2FucyUyMFNlcmlmJTJDTW9ub3R5cGUlMjBDb3JzaXZhJTJDTVMlMjBHb3RoaWMlMkNNUyUyMFBHb3RoaWMlMkNNUyUyMFJlZmVyZW5jZSUyMFNhbnMlMjBTZXJpZiUyQ01TJTIwU2FucyUyMFNlcmlmJTJDTVMlMjBTZXJpZiUyQ1BhbGF0aW5vJTIwTGlub3R5cGUlMkNTZWdvZSUyMFByaW50JTJDU2Vnb2UlMjBTY3JpcHQlMkNTZWdvZSUyMFVJJTJDU2Vnb2UlMjBVSSUyMExpZ2h0JTJDU2Vnb2UlMjBVSSUyMFNlbWlib2xkJTJDU2Vnb2UlMjBVSSUyMFN5bWJvbCUyQ1RhaG9tYSUyQ1RpbWVzJTJDVGltZXMlMjBOZXclMjBSb21hbiUyQ1RyZWJ1Y2hldCUyME1TJTJDVmVyZGFuYSUyQ1dpbmdkaW5ncyUyQ1dpbmdkaW5ncyUyMDIlMkNXaW5nZGluZ3MlMjAz",
    "register": "0",
    "__we_m_cv__": "Y2FudmFzJTIwd2luZGluZyUzQXllc35jYW52YXMlMjBmcCUzQWI2YzBhNWQ5ZmIwOTE1MTcyYTUzNTUwMGE5MGRiODQ4",
    "__we_m_ftk__": "ZDFjMzU2YTc4NjBiN2RlNDMxZWY1MzlhOWRkOTMzYWI=",
    "__we_m_cf__": "{\"t\":1766451817980,\"v\":\"VjVWsffe3bR08C-YJTHCgVJMVNXePKoXqunavn3XpSu6yrWz2BBU_5tUTk_cQGdPMjjwwDuspUBvTstk28_PhAEIwVoZkT_zEAgvZMWIQGGgRhJUUWrEI3LhSpA5nhh7dYn66wn3SwFugy_MB5ABgwo1907PGCBoC0hh3YEGIdgEphiCekFHrCrgmOKkUzFbt4mn0A97Z8F-8xeqjzjaNviZ2bRZ12vXy2UjvFtVgNy487k94FZ9WcsN37q_xr2RRct54Dy_lsoFdOPOjFxtPvX8a_9tKDPejT8f1_wYBf8XAqfr_i5Fk8TQuWqrxDNfHxGs0ccpzINbt1IZmll5eOKPv5FWqLXh16u4GhKSB3PGydRgf8jLgdR4b0QA89c3oBz6nMXOkEyrtEkuTxUpC8bm6ztzt6BUb2yGrXei2vw6RW27-mukDJr9tmbPbkwa3TrryhpM8tiLd_9xEK9Tmsiy_wLguIx5OnoNqLjzH_EM08JxU2Aw92c-N-tF3clI9cVJiDAshghZXrKIFlEpzjI4oZGH6MrjtQY2j9hYdsMRaMNNXTPEpUT8pt-BiiP3lMW0vXyOa08-Nd8y9jL7Pq-JZ9PkLFoCQa4lb3FYBGOdqYM54DHGiEO-9LcaWwVniz4He9ARY_5z-dFC2G1SP1oLAEse0g4AQzk10g9xebKRsn6079rs2OpevingaW9fn5iTVS5HGInW0IjBfJuHm9h9-6VqIM1miZGhiPpV5kEvNImcPM4wIJKgmd0PSUDBk_TRQVps_Doj-V21y31jgEDZxJgtgpds2lOl19vPHIplYEGmQ6v2N6S0rLXhS2j8zuPqrmdI0d-JR61zOUFMmVgiGBWckjzPhhZ8DN5sLiomur8-ILk1KbOmXOcus05-X3yt3aWcc1t-6XDHV8cQuhujgSAWgRWhSVogMBQOZtyogB40W2pmEPC6KVeb2MyrGCxZJ1VIxMg4HDkbtLVr7tPpnk7iof4q6aTAJ3aFwDpoqUPggco2ywnHT_-HzWBilG5KdJyAbaxw9yGVAe7tLpaghCMuyOc5QRmvLWIY8GWkOgiyE5AUh3u0h1muAKv3ce7bjMPRCEnXro6bFzehwWWVtQf0kTuSWJVJ1WsyGfp20OTvM4spFtzYb31xRohibL1ux-ydNeTbJPPUzkem00Uft_wzlduZ5SqlvM9tr-JiWb_IEE-vslujfQqoy77DPASnvPF08Gk3n89SjspsTd2O_9p_PPvUVjquXkGgp8jH5bLa0ovcsrWy_stIDaAUZUV2xZ8k6VasiowjBOGp3HdPwZyyHFY1sXVNBjyzsvK3uTGGxb__T_iQrPAxwAQPUj_bk85bNRlOzVr2z6voLBbkKYDCnJYIwI6igxVx8ZxU4WCKk3DJNzSAKoUwipxM-zxvXSstqVMjwOZ94wPZnf1SCarZWDnpiNBe3RuhvsXNfxPfo6dCvOy_lMEvaPNBkyGQlNDlQ2DoCEPL23esBr3wReg0aJljQYQmceWgP_HJ5WtpRhBzwGU0qAl_0R0wHKro3Xx_R4l64CQWo7xtMuKYx9N-GJFjDgzJuakt1tMu096zWnjpAVrTiqECTELeJYQc_K-QOKReUYfykJi78wWkKuosYFV3HOj0-TmRanq0rpqEH3S2czbwn-sTeC9zh9ZVzNRxrtGuUXFu9IAX1Gi1psDKOWmS3rXvtM2w6Y3iw2WSjh5y9dAg_2emCfS_nIJ7N4zs9JXD7PbnLQ1dHPSqtVpq0gpWaDwg4csn-0B9AYcoWS5XZhbH_DTIaWdXALS7OwiniXZv4VZG1fvqkENoNFFNpngB7AEDvladQ_8GHfjLiYeOUxR7Ld4yG127krVFVBHa4TygnrEGij2Df8rJYYoZF2YkFIvLIsJCe7570XvWh85-Xm3vL-s-UESjybCLfaS0niC-_HruGvnjN50ucHHuwsRV5uBPd9XJ_8xD1y_-hQs-2YYejzfLBq4vMY1hbkMk-8iqw4tBckZeFRjWwA9nqzy_aZgtlaTrwKsLD-CLqNfR2Cu3shIJMbRRUVn4zccmsAXS-TcMGXw-fdC-nopp03xoN-veynZM728mgiDPr-RfPts97-gVP41T_XSq5_9xgiPwKIhbFSkEUTpT41-YbnPHbc_hTKU9TNLddBUjaqsMZHRQF-yFiqF-xLoMiF1DVVP_ui7jGBMaIR4EAulpE2ZzMoVvWl2PvqjsQwyWKfyD6lVVvoymxROQHAmL30GTSiMcGJn2uV33Z3T3fbqLgKPyAqNpCZZUCYiIs-Ddz_9oZAjYdTyI_8t2CtQ1ZNZ4bGr2s-_eSAB0Vg8z_-8tCYG8R0XrFIbtBMXqOBf3WzNOGStY4m5d7do77xWT2yFvdBuhl1WpY4-LslwmKKsPlcOeNOpvArE9tXI5PVmhqifr_jerjgnfrZSm2kKc9-UOiMq8VTCCwFIAiGuRULQO1tBVnAaMZjCwyCf07k3-5YaYcxQZ07a04U7Samih0XiT1851gfGVc94dIEye_KZUwQIHNVCJR2qgh0yaQVrX_qXvIMcZohS2ijVhnvXzAIvNV3-6c57R4jTNMQObfSIMuQJ4mJNWBWTUMEVjR9QEYS6YU9XRAiJHkufcZ5RDd-K3wDZSjl2h5KW_QQGfJ3TaNmkb_8z9k5sf2bLnWAKppFsVG9x86kdA9HlIa9-4ck5sr-DxXaRyve7DKxH62ilOIQCc7CCvTpmcR3TVdiEoVODTpJzds-FBrL5DFATiHkrWqKENAtbXqlI1ZaCOz1JdAHGHo7_DLA4wjyx64L_GnPECP7hsSuuWrk7ZCOg2kH1McluWlVTt7M8ZZxbIphVKGS7ZhvHQhI-xKhk_KI_rDLDvp-k1z9oRZkm297hqJ4RSoozbKkMVMNPp9rNMzSrqYCTQvXCYq2fcJzb29PNUHLLIZrojDmi6l60mthwp6SLVtUAQIv324RFpdHK9ur8cE9FRjyErZgcSCPtOJWXOjZ2t5_L9xY7QWCPrFpXGLte6RqJL3zgfrsRngdc8h6o8nWxZhwI272wbYnadqAUUl4nhFfu5CaW1aRNeSk6YSqQ6w4cxxpD3loo63bXRdXclvTL5RhTeXlytoNQe7YsI6bvKTnKGFi5-P8OdyZrABwKQxD_CGHHmcTqSM4soHJQOaUNoompnU5f-Bvo7KogJm5FTwhjUUbYaLxvKo3HDRh4-mzFFLOngu8sY41CmiqMVzcKpQ3RFhrfSgaYPuhTG1JM2yzfYt3UZlXJTd5Z1df0JjJ9T-gQuSpJ3aWBdrK7LUyHX05fvW5o5DK_-VEAEOudFE9EKiaU4W30U-PU9EKQQuQAX9aa1zM3i_TL7IV6P4X-nNKcFJdepEXMCroERxSNdg45BzrjOz_z8oWcS5RMkic_N0RWTpBq4eFKPLiJYe9Xr7ROpS_whH7QWZZ_ORmySZAhewOVjT5vjj0nTM84L6QRistDzAnBtd6_mopAAX_5gB-LFZivcOQK9XIPHdM9tspuk3x0ERhbu86lkZGWq3w4T8WMSTLHAW_WMpahqYr3ebeJThm0TYqFCDFfknI2W2NkO5xo0QJ0pb8qvM3DBoZLzyGkX14gpGspb1nB5fNcHDQdvfDgvNhVje33WztquW1BXfL2ZokVVaSf3YLT1508tnUltbQCknnxnpTjvDDiaaWRGPpY8zLOVcWvhYQyi2LeSxfliXdcOTsx9W3p60R5JbvYkWVsPp0QaqD_4C_rLBvwU78Dlnl6X0TLH0cy53r4yGDf6GMc0Fomn6aBmZTTXdQGJc23XY_lmL3YTZNde5UvHe7m5Abfkg0hIBQfVK2xGHAMlijahRR86c4LeUm3LSjlQxD048HNQHZ-FvNVSTFl-kPKo4jiV-lGirE44VLq5VVLFMNYKvMENcH6368BpL85ToGSVzuSjvn6Qi5JAcCpgSpPDl8sxOvEEFAxK1hh_4TvbIEqrqrrUzJleNjS-kWBCSuKSm3WJFXWaRmZc97q0bypUiXASqsWM8BbJ2YWzrfG48oWIOck5vbQm1YoqEu-Q7U9URo_5_xlOnhyKaL4j0fBf1q_VFvWln4ZsumaqVyZ93RhJx2HpXYAknhWEJdBKXMxjcSj8spHGFF2jqRknUd8G_oANttZZ65HJzO0THg6GxoPcNXMsXySQ0RjouQ9wVta2GwWVQk_xp7kYjgA16bT2ycJWDU0Dah68fDph4HRf-77ONZEAFFgYNcBoVx1seGABL80P_UHM1ZJRfcq-0aj8H102nEbRrJX7hxDuA1k0JE68jahVzQZqAwrKas10aZN_-fslqjeRpwYUqB-6XhjhxK-kMX6UwrcDunJxpyKWOI_5\"}",
    "JDst_behavior_report_flag": "{\"8000\":1}",
    "localImprovingAccountFlag": "",
    "PCA9D23F7A4B3CSS": "307786bbd011d8ede56d7f417b45e7b3",
    "shshshfpb": "BApXW4keyS_5AK1xG9dI3EXQZvXYzZQH7BiQAF7pp9xJ1MuVwVI-28XS9j3n-NYNycONZ5PffhNqaUQk",
    "JDst_behavior_flag": "[{\"t\":1766451864201,\"e\":3600,\"v\":\"Fl\"}]",
    "shshshfpx": "e4ddf256-0795-d9a5-c6d0-d40188a3b021-1766411095",
    "shshshfpa": "e4ddf256-0795-d9a5-c6d0-d40188a3b021-1766411095",
    "PCTSD23F7A4B3CSS": "1766452356945",
    "_isGotoIndexFlag": "",
    "WQ_dy1_tk_algo": "{\"izam9gw3tt0pwt62\":{\"73806\":{\"v\":\"eyJ0ayI6InRrMDN3YzMxZDFjMzYxOG5xRzhrMHpUZGsxYXBOUkJ1dUh3WnY3cXVXSkVhZV8xbXFEVGNTVkNYWnJfSjVjSl9YdDhSNHU2WVZWYjN6QzR4YWpJTUt5OUQ4MUJvIiwiYWxnbyI6ImZ1bmN0aW9uIHRlc3QodGssZnAsdHMsYWksYWxnbyl7dmFyIHJkPSc2c3dNejlpczdtVHEnO3ZhciBzdHI9XCJcIi5jb25jYXQodGspLmNvbmNhdChmcCkuY29uY2F0KHRzKS5jb25jYXQoYWkpLmNvbmNhdChyZCk7cmV0dXJuIGFsZ28uU0hBMjU2KHN0cik7fSJ9\",\"e\":86400,\"t\":1766411095745}},\"gigt63zmaj3qjh32\":{\"586ae\":{\"v\":\"eyJ0ayI6InRrMDN3OTllZDFjNGMxOG5TOVJkSXBPMWlZQ0NaaDYteGRMMW5hZDVtcDhPa3BLSk1vNHRIVmdxT2VBUmNJTktXRWdZZ3l2RXk5MHpBQVVRUEJ5Y01xOGJwR3RsIiwiYWxnbyI6ImZ1bmN0aW9uIHRlc3QodGssZnAsdHMsYWksYWxnbyl7dmFyIHJkPSc3NFRmbHFlYklmdVEnO3ZhciBzdHI9XCJcIi5jb25jYXQodGspLmNvbmNhdChmcCkuY29uY2F0KHRzKS5jb25jYXQoYWkpLmNvbmNhdChyZCk7cmV0dXJuIGFsZ28uU0hBMjU2KHN0cik7fSJ9\",\"e\":86400,\"t\":1766411095746}}}"
}
window.AudioContext = function () {
    return 'AudioContext() { [native code] }'
}
window.devicePixelRatio = 1.25
window.WebGLRenderingContext = function () {
    return 'WebGLRenderingContext() { [native code] }'
}
window.screenTop = 0
window.screenLeft = 0
window.outerWidth = 1920
window.screenTop = 1024
window.innerWidth = 1536
window.innerHeight = 700
window.outerHeight = 28

createConstructor("HTMLAllCollection", true, [], {}, {})
createConstructor("EventTarget", true, [], {}, {})
createConstructor("Node", true, [], {}, 'EventTarget')
createConstructor('Element', true, [], {
    getAttribute: function (args) {
        console.log('Element.getAttribute方法获取的参数:', args);
        return 'getAttribute() { [native code] }'
    }
}, 'Node')
createConstructor('HTMLElement', true, [], {}, 'Element')

createConstructor('HTMLHtmlElement', true, [], {}, 'HTMLElement')
createConstructor('HTMLScriptElement', true, [], {}, 'HTMLElement')
createConstructor('HTMLHeadElement', true, [], {}, 'HTMLElement')
createConstructor('HTMLAnchorElement', true, [], {}, 'HTMLElement')
createConstructor('HTMLBodyElement', true, [], {}, 'HTMLElement')
createConstructor('HTMLDivElement', true, [], {}, 'HTMLElement')
createConstructor('CSSStyleDeclaration', true, [], {}, 'HTMLElement')
createConstructor('CanvasRenderingContext2D', true, [], {
    rect: function (args) {
        console.log('CanvasRenderingContext2D.rect方法获取的参数:', args);
    },
    isPointInPath: function (args) {
        console.log('CanvasRenderingContext2D.isPointInPath方法获取的参数:', args);
    },
}, {})
createConstructor('WebGLRenderingContext', true, [], {}, {})
createConstructor('HTMLCanvasElement', true, [
    {
        name: 'style',
        value: watch(new CSSStyleDeclaration(null, null, CONSTRUCTOR_TOKEN), 'canvas.style')
    }
], {
    getContext: function (args) {
        console.log('HTMLCanvasElement.getContext方法获取的参数:', args);
        if (args === '2d') {
            return watch(new CanvasRenderingContext2D(null, null, CONSTRUCTOR_TOKEN), 'canvas.getContext.2d')
        }
        if (args === 'webgl') {
            return watch(new WebGLRenderingContext(null, null, CONSTRUCTOR_TOKEN), 'canvas.getContext.webgl')
        }
        if (args === 'experimental-webgl') {
            return watch(new WebGLRenderingContext(null, null, CONSTRUCTOR_TOKEN), 'canvas.getContext.experimental-webgl')
        }
    }
}, 'HTMLElement')

script = watch(new HTMLScriptElement({
    parentNode: watch(new HTMLHeadElement({
        removeChild: function (child) {
        }
    }, null, CONSTRUCTOR_TOKEN), 'script.parentNode')
}, null, CONSTRUCTOR_TOKEN), 'script')
a = watch(new HTMLAnchorElement({
    setAttribute: function (args) {
        console.log('a.setAttribute方法获取的参数:', arguments);
    },
    href: "https://union.jd.com/proManager/index",
    protocol: "https:",
    host: "union.jd.com",
    search: "",
    hash: "",
    hostname: "union.jd.com",
    pathname: "/proManager/index",
    port: "",
}, null, CONSTRUCTOR_TOKEN), 'a')

createConstructor("Document", true, [
    {
        name: 'all',
        value: watch(new HTMLAllCollection(null, null, CONSTRUCTOR_TOKEN), "document.all"),
    },
    {
        name: 'documentElement',
        value: watch(new HTMLHtmlElement(null, null, CONSTRUCTOR_TOKEN), 'document.documentElement')
    },
    {
        name: 'cookie',
        value: 'qid_uid=5acb7a0b-20a9-44de-9d9e-4f7e18dda935; qid_fs=1765953718936; qid_ls=1765953718936; qid_ts=1765953719007; qid_vis=1; qid_evord=47; __jdv=167603711|guanwang|-|-|notset|1765953760573; __jdu=17659537605721288442981; shshshfpx=2e909e2e-3c60-324b-4d87-c35372175750-1766403665; wlfstk_smdl=p382hk59fz52u4gyvedqaf5z2ndu4ndu; mba_muid=17659537605721288442981; mba_sid=1766409944598172350307.2; 3AB9D23F7A4B3CSS=jdd03QA7ZODRTI6EKYEEXW3WPYRHKYMQPSSWKJHJQ3JC4ZSG36CZ46MH7J5LTLSKNIQB2AAKOYTC25S2S4IPG5K6JEGHRGAAAAAM3IY7E3QQAAAAADLD5UORP5EDV4EX; 3AB9D23F7A4B3C9B=QA7ZODRTI6EKYEEXW3WPYRHKYMQPSSWKJHJQ3JC4ZSG36CZ46MH7J5LTLSKNIQB2AAKOYTC25S2S4IPG5K6JEGHRGA; shshshfpa=2e909e2e-3c60-324b-4d87-c35372175750-1766403665; __jda=209449046.17659537605721288442981.1765953761.1766403666.1766409864.3; __jdc=209449046; shshshfpb=BApXW-fg2Rf5AZjA-zifc__9OqiTJ0eaKBiQBMUpo9xJ1Mu4VVI-28XTv2XqsMNArdrcB5_fV0-7I06Y; __jdb=209449046.12.17659537605721288442981|3.1766409864; sidebarStatus=0; sdtoken=AAbEsBpEIOVjqTAKCQtvQu17bGD8nUCEFc67FJhPXh0k_qj2PqfUfwEf3YxoD5SzE5k-l54Jmwf0TonV1FcpEhMZARbISKkCAIO-pYyHyKzhp2cF0Ah-sezHoquXiVu6RChi3sOFgDDK27k'
    },
    {
        name: 'location',
        value: {
            // "ancestorOrigins": {},
            "href": "https://union.jd.com/proManager/index",
            // "origin": "https://union.jd.com",
            "protocol": "https:",
            // "host": "union.jd.com",
            // "hostname": "union.jd.com",
            // "port": "",
            // "pathname": "/proManager/index",
            // "search": "",
            // "hash": ""
        }
    },
    {
        name: 'body',
        value: watch(new HTMLBodyElement(null, null, CONSTRUCTOR_TOKEN))
    },
    {
        name: 'compatMode',
        value: 'CSS1Compat'
    },
    {
        name: 'referrer',
        value: ''
    },
    {
        name: 'head',
        value: watch(new HTMLHeadElement(null, null, CONSTRUCTOR_TOKEN), 'head')
    }
], {
    createElement: function (tagName) {
        console.log('Document.createElement方法的标签', tagName);
        if (tagName === 'script') {
            return script
        }
        if (tagName === 'a') {
            return a
        }
        if (tagName === 'canvas') {
            return watch(new HTMLCanvasElement(null, null, CONSTRUCTOR_TOKEN), 'canvas')
        }
        if (tagName === 'div') {
            return watch(new HTMLDivElement(null, null, CONSTRUCTOR_TOKEN), 'div')
        }
    },
    createEvent: function (type) {
        console.log('Document.createEvent方法的类型', type);
        if (type === 'Event') {
            return Event
        }
    },
    getElementsByTagName: function (tagName) {
        console.log('Document.getElementsByTagName方法的标签', tagName);
        if (tagName === 'head') {
            return []
        }
    },
    querySelector: function (selector) {
        console.log('Document.querySelector方法的选择器', selector);
    }
}, 'Node')
createConstructor("HTMLDocument", true, [], {}, 'Document')
window.document = new HTMLDocument(null, null, CONSTRUCTOR_TOKEN)

createConstructor("Navigator", true, [], {
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36'
}, {})
window.navigator = new Navigator(null, null, CONSTRUCTOR_TOKEN)
window.location = {
    "href": "https://union.jd.com/proManager/index",
}
window.screen = {
    pixelDepth: 24,
    width: 1536,
    availHeight: 824,
    availLeft: 0,
    availTop: 0,
    availWidth: 1536,
    colorDepth: 24,
    height: 864,
    isExtended: false
}


/* 代理监听 */
window = watch(window, 'window')
window.document = watch(window.document, 'window.document')
