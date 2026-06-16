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

window = globalThis;
top = self = window
window.ActiveXObject = undefined
// window.name = '$_YWTU=a.fmki9TP3VFv5hZntKMbZr5P_HhLijm8SdKHgpRniV&$_YVTX=Ja&vdFm='
window.setInterval = function () {
}
window.setTimeout = function () {
}
window.history = {
    'length': 14,
    scrollRestoration: "auto",
    state: null
}
window.chrome = {
    "app": {
        "isInstalled": false,
        "InstallState": {
            "DISABLED": "disabled",
            "INSTALLED": "installed",
            "NOT_INSTALLED": "not_installed"
        },
        "RunningState": {
            "CANNOT_RUN": "cannot_run",
            "READY_TO_RUN": "ready_to_run",
            "RUNNING": "running"
        }
    }
}
// window.innerHeight = 720
// window.innerWidth = 1280
// window.outerHeight = 824
// window.outerWidth = 1536

createConstructor('EventTarget', true, [], {
    addEventListener: function (type, listener) {
        console.log('addEventListener方法获取的参数:', type, listener);
    },
}, {})
createConstructor('Window', true, [], {}, 'EventTarget')
Object.setPrototypeOf(window, Window.prototype)

createConstructor('Node', true, [], {
    appendChild: function (child) {
        console.log('appendChild方法获取的参数:', child);
    },
    removeChild: function (child) {
        console.log('removeChild方法获取的参数:', child);
    }
}, 'EventTarget')
createConstructor('Element', true, [], {
    setAttribute: function (name, value) {
        console.log('Element.setAttribute方法获取的参数:', name, value);
    }
}, 'Node')

createConstructor('CSSStyleDeclaration', true, [], {}, {})
CSSStyleDeclaration = watch(new CSSStyleDeclaration(null, null, CONSTRUCTOR_TOKEN), 'CSSStyleDeclaration')

createConstructor('HTMLElement', true, [
    {
        name: 'style',
        value: CSSStyleDeclaration
    }
], {}, 'Element')

createConstructor('HTMLDivElement', true, [], {
    getElementsByTagName: function (tagName) {
        if (tagName === 'i') {
            return []
        }
    }
}, 'HTMLElement')
div = watch(new HTMLDivElement(null, null, CONSTRUCTOR_TOKEN), 'div')

createConstructor('HTMLHeadElement', true, [], {
    removeChild: function () {
    }
}, 'HTMLElement')
createConstructor('HTMLScriptElement', true, [
    {
        name: 'parentElement',
        value: watch(new HTMLHeadElement(null, null, CONSTRUCTOR_TOKEN), 'head')
    },
    {
        name: 'innerText',
        value: `$_ts = window['$_ts'];if (!$_ts)$_ts = {};$_ts.nsd = 6855;$_ts.cd = "qWpErfAlo1EqiSQmlGqPqPEkiu01qcErEG3kH1EmiSQcqqVlcqAMlGqPHnEliu0Pqu7UrrEqEGlPrGWeEGAPrsalcAAPlGqwqALjqr0rcSEqoAlWEGl4maEPHk7UrpEqEGEwqpVbrqLlEnLqEGQPrk7elGqPqPEkiu0jqcErEG34HpEqEGAPrs7eDGElcaAMlGqPrPEoiu01qrLmEGE4HpEqEGqPqs7eEG3ZkqA3EGW4maA1qcErEG34rpEqEGAPrs7eEGElAq3rJslcrsx3rOJn7qjhlwJs5GDQr57TmeQg8DIEsJV9RiqgNsRb.z96gP_O_9wUdHPZDz5_UIBBgdZkrkWorDaohqiDKUabt9pzKsp61CGNwcT1MONDwnYPKKecp1V5JT0uhnQGtuVSKnZfMUwmUpgdwsNhAkrPElJ.MKfAMUW5pnlyU296tlg9huJ3U6LLqvJBMn2RUkpqFoRBF1yNQArjhCTaMb7LqvJBMTGXUkpqFoRBF1yNQArjhCTaMb7LqvJBMTfIKGyzh9rWVuxkJuYSim2f1upCcOxvioYbRVEcIC2pHbYsFGYB3mwriUw6k9JKpUeWHkE9UDmEsVRzs122RkfhJUefmmpMFmJb1YYUw6wJFKTpAcZaRTJKiYgSqTRU1VwNI9aHM1TGRbWdJTT9hK2CiVppibJVJl2HJoRRFPTGRbWdJTT9hK2CiY0utORx1sY2UT09AcTGRbWdJTT9hK2CiVJerTrV8CRXwDagUPTNwO2WMsfUVCSwwDyYK0ZgV6rV3C3RwCzc3bzbHnJZQsmVp9TtH0mAVkyjWmS3FsruY6wBpu3L3Dr9iOATkPfNQkybsVTRwUNJJCfcVpLL3Dr9iOATkPfNQkg7RDQJHOqnRnSzwTwq3Kfn8lztKYyW8uVyRDYIVkz0wof6J1yPqaWmquQlMsQklKTCQ6pKJsl_Hs35WmVTJO9eWGQckCYPiu3urawFWsQkkuW6WTGSiOWSWsVlFugaiOQTJur7mXcXGy4BYOnfSAUo0ZB_nP0klaqXHFy3E_MyFAAlrC9lrqQmEGNrKZkpeugVPT2fA2tN_i4sE7KrAVmma_WWfB6DeZ.Lray8WklnHsACHmZdqaETqG0TKuq4Jk3CJkp3rPfoVlJPKazmRO30F2G0tCyKKCRsFOVvACrXAKzGVrzdwOYuWbajt9JcJVESrap7ruQkrkEorY7oekpdhbR2knNPMvQXRvQrtbxTMcy2RAQj3KxShbYNocNfFb7XRcGHRClBRvm0tqeTw1ebMKLLk6RuhCmOQnGEFbZB3KT9tqfNwnefMKpZADJ4RP2vForq3DePtKp.R0rGMD0NRDfaADr7MUlX3Dqitbpj3nyGI9rfFCaNFbz0ADyuQn2jQCwqMCr7tKzNMVrBMKVNFC26ADeaMc2LwcGDR6lBM6xGtqRCRbANFop.qPNN3vJOtCGmRceBFbV.FAYPhCyTJPzNoDQBMOmOtC9QJ1eXwKV.FAwahCyjRPzNq6qBMbSBtC9QwPeXwb7.FpSORcej3D0LqCY4hCN23cGkFblBFbyPtqJnR1eT8nz0mKVBQCpSt6AhFneuwKZ.wrSTh6JTwPz0cDqBQ6YCInGQFDABwKz9trSjFPeTQKWLoKe2h6pCInG8RneSFcyTRAljQKyu3czCcKlBQKrSt6333ceSRoq.waWjQDmNhvpPmcNawDAXwoWttvrT3Py0IpZjwCx6hvJ2mPN6FbWXQC0t3ce6FvrT3Axnh6wewPzaDDqBwURbt6EIw1eTwvV.QfpPh6pjRDlLDC22RsQXQD9FtvpXRcyaRpLjwoJChvebq1N4QCGXICGItvzBwvL.Irejh6zLMPz5AoSjQn2OwCeqwbejwv3.MpSvqaWmr2GGr0AkrTLbKor7q2avFK9oqkWPx6EmqkACMqA4iaVkJGpzJaWkrAEorDaDqa3uWOQ0Uq3oJs06WGA0U1mTRoqvMq2vRCR6QYpaobezRmR6R1xtEombwvxLFfeOhKzG3CJfovVzRKNaAbVHMP7.QCJ.QA9jECfG8ngP1Pr.Rbpb3v3IYUwSMDSGxlQ4ECfG8nYRRG";if ($_ts.lcd)$_ts.lcd();`
    }
], {
    getAttribute: function (name) {
        console.log('HTMLScriptElement.getAttribute方法获取的参数:', name);
        if (name === 'r') {
            return 'm'
        }
    }
}, 'HTMLElement')
script = watch(new HTMLScriptElement(null, null, CONSTRUCTOR_TOKEN), 'script')

createConstructor('HTMLMetaElement', true, [
    {
        name: 'content',
        value: "AEPrYIjzUvzyFrtAIF45MUzV42CuN6ZU5MC7DcHG4G.9fwMcG3bkkbDjSaeUZP2u_SLDFn7G1aK_Z8ahl5k8uEV8xzl_uDmZzy0NoXl1zZI_ODXqXpLMMBZ0F9SNqB42WsVeEahzYMscUvsv_7wsrUacloA9QLn.MoiTyV2MKNnbEgL9CqnJKI.J8bZfGsUohcZ1PJ601C4txPKxBzAMDlIsbGs0WQBjwoK3urZeg1XCyLRsxzvOWT1n5ZwbKg94O1hkWfqxNnsg8BUHaKGQq0ltpts9pxmm"
    },
    {
        name: 'id',
        value: "FbkwzLN5XOx0"
    },
    {
        name: 'parentNode',
        value: {
            removeChild: function () {
                console.log('HTMLMetaElement.parentNode.removeChild方法获取的参数:', arguments);
            }
        }
    },
    {
        name: 'baseURI',
        value: "https://qikan.cqvip.com/Qikan/Journal/JournalGuid?from=Qikan_Journal_JournalGuid"
    },
    {
        name: 'namespaceURI',
        value: "http://www.w3.org/1999/xhtml"
    }
], {
    getAttribute: function (name) {
        console.log('HTMLMetaElement.getAttribute方法获取的参数:', name);
        if (name === 'r') {
            return "m"
        }
    }
}, 'HTMLElement')
meta = watch(new HTMLMetaElement(null, null, CONSTRUCTOR_TOKEN), 'meta')

createConstructor('HTMLAnchorElement', true, [
    {
        name: 'baseURI',
        value: "https://qikan.cqvip.com/Qikan/Journal/JournalGuid?from=Qikan_Journal_JournalGuid"
    },
    {
        name: 'namespaceURI',
        value: "http://www.w3.org/1999/xhtml"
    }
], {}, 'HTMLElement')
a = watch(new HTMLAnchorElement(null, null, CONSTRUCTOR_TOKEN), 'a')

createConstructor('HTMLHtmlElement', true, [], {}, 'HTMLElement')
html = watch(new HTMLHtmlElement(null, null, CONSTRUCTOR_TOKEN), 'html')

createConstructor('Document', true, [
    {
        name: 'documentElement',
        value: html
    }
], {
    createElement: function (tagName) {
        console.log('Document.createElement方法获取的参数:', tagName);
        if (tagName === 'div') {
            return div
        }
        if (tagName === 'a') {
            return a
        }
    },
    getElementsByTagName: function (tagName) {
        console.log('Document.getElementsByTagName方法获取的参数:', tagName);
        if (tagName === 'script') {
            return [script, script]
        }
        if (tagName === 'base') {
            return []
        }
    },
    getElementById: function (id) {
        console.log('Document.getElementById方法获取的参数:', id);
        if (id === 'FbkwzLN5XOx0') {
            return meta
        }
    }
}, 'Node')
createConstructor('HTMLDocument', true, [], {}, 'Document')

document = new HTMLDocument(null, null, CONSTRUCTOR_TOKEN)
document.visibilityState = 'visible'

window.location = {
    "ancestorOrigins": {},
    "href": "https://qikan.cqvip.com/Qikan/Journal/JournalGuid?from=Qikan_Journal_JournalGuid",
    "origin": "https://qikan.cqvip.com",
    "protocol": "https:",
    "host": "qikan.cqvip.com",
    "hostname": "qikan.cqvip.com",
    "port": "",
    "pathname": "/Qikan/Journal/JournalGuid",
    "search": "?from=Qikan_Journal_JournalGuid",
    "hash": ""
}

document = watch(document, 'document')
window = watch(window, 'window')
location = watch(window.location, 'window.location')

createConstructor('DeprecatedStorageQuota', true, [], {}, {})
createConstructor('NetworkInformation', true, [], {}, 'EventTarget')
navigator = {
    "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36",
    'webkitPersistentStorage': new DeprecatedStorageQuota(null, null, CONSTRUCTOR_TOKEN),
    'connection': new NetworkInformation(null, null, CONSTRUCTOR_TOKEN)
}
navigator.maxTouchPoints = 0
navigator.platform = "Win32"
navigator.languages = ['zh-CN', 'zh']
navigator = watch(navigator, 'navigator')

createConstructor('Screen', true, [
    {
        name: 'availHeight',
        value: 824
    },
    {
        name: 'availWidth',
        value: 1536
    },
    {
        name: 'height',
        value: 864
    },
    {
        name: 'width',
        value: 1536
    },
], {}, 'EventTarget')
screen = watch(new Screen(null, null, CONSTRUCTOR_TOKEN), 'screen')

createConstructor('HTMLCanvasElement', true, [], {}, 'HTMLElement')
window.HTMLCanvasElement = new HTMLCanvasElement(null, null, CONSTRUCTOR_TOKEN)
createConstructor('CanvasRenderingContext2D', true, [], {}, {})
window.CanvasRenderingContext2D = new CanvasRenderingContext2D(null, null, CONSTRUCTOR_TOKEN)
createConstructor('WebSocket', true, [], {}, 'EventTarget')
window.WebSocket = new WebSocket(null, null, CONSTRUCTOR_TOKEN)
window.localStorage = {
    "tfstk__": "gveiVImyP5l1TmLFEEk1_IySCY5p5AMjmrpxkx3VT2uIXlUO1SV3uoAYXxEqor4KRcZTW1N0-R4B6mEA1i43IyOtDoC1meZ8S-U0cGiqurzmk5CdelZshx7-nTB8fKye_R4M3VuF0mnW3MhNz2Dztx7Ry93A30qK3lHv41GUY2iDQIoauvJE428quruZTeooVxu4urleY0mibqoqgplERmkqurlNLMmj8ckq3rrFxmM4L1u_3JyFkdYqc64NW-ois4rZ7lETL1G61l33kryIjJm7bQJ23JmisJcPg8ym6SrSNRelnpMTqWkEq87XiqeT2-HEn9YrJRZ8Nbw1433UBoySWR7pBVy_t7h01aA7rA4maRlH0Krnn5HnY8SvN2enWryiTgpoMvy-aAPdONhxI044CPxD3zrL2RGQnaYEl5nSL02PlI0YBuexLYSPoBRrlYJjYieeGIGZAD0RbySDw0HssKshxQSj_DisyMjHGIGZAD0RxMAP1foIf4C.."
}
window.sessionStorage = {
    "Hm_unsent_17262dc62ce874a510e9c97140f381d6": "[\"hm.baidu.com/hm.gif?hca=A95CEE54BFD860E0&cc=1&ck=1&cl=24-bit&ds=1536x864&vl=703&ep=220948%2C12661&et=3&ja=0&ln=zh-cn&lo=0&rnd=2127095777&si=17262dc62ce874a510e9c97140f381d6&su=https%3A%2F%2Fqikan.cqvip.com%2FQikan%2FJournal%2FJournalGuid%3Ffrom%3Dindex%25E2%2580%258B&v=1.3.2&lv=1&sn=9970&r=0&ww=1536&u=https%3A%2F%2Fqikan.cqvip.com%2FQikan%2FJournal%2FJournalGuid%3Ffrom%3Dindex%25E2%2580%258B\"]",
    "Hm_unsent_fee827c3dc795c5122daf5ee854c1683": "[\"hm.baidu.com/hm.gif?hca=A95CEE54BFD860E0&cc=1&ck=1&cl=24-bit&ds=1536x864&vl=703&ep=220918%2C12628&et=3&ja=0&ln=zh-cn&lo=0&rnd=1153268170&si=fee827c3dc795c5122daf5ee854c1683&su=https%3A%2F%2Fqikan.cqvip.com%2FQikan%2FJournal%2FJournalGuid%3Ffrom%3Dindex%25E2%2580%258B&v=1.3.2&lv=1&sn=9970&r=0&ww=1536&u=https%3A%2F%2Fqikan.cqvip.com%2FQikan%2FJournal%2FJournalGuid%3Ffrom%3Dindex%25E2%2580%258B\"]"
}

require('./encrypt_js_code')
require('./decrypt_js_code')

function get_cookie() {
    return document.cookie
}

console.log(get_cookie());