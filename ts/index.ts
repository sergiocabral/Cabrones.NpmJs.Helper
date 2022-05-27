// TODO: Os testes precisam passar no inx tbém, ou será quenão!?

import sha256 from './3rdParty/sha256';

import { DispatchedMessage } from './Bus/DispatchedMessage';
import { IMessage } from './Bus/IMessage';
import { Message } from './Bus/Message';
import { MessageListener } from './Bus/MessageListener';
import { MessageSubscription } from './Bus/MessageSubscription';

import { DateTimeFormat } from './Data/DateTimeFormat';
import { DateTimeFormatMask } from './Data/DateTimeFormatMask';
import { HelperDate } from './Data/HelperDate';
import { HelperList } from './Data/HelperList';
import { HelperNumeric } from './Data/HelperNumeric';
import { HelperObject } from './Data/HelperObject';
import { HelperText } from './Data/HelperText';
import { IDateTimeFormat } from './Data/IDateTimeFormat';
import { INumericFormat } from './Data/INumericFormat';
import { NumericFormat } from './Data/NumericFormat';
import { WordGenerator } from './Data/WordGenerator';

import { EmptyError } from './Error/EmptyError';
import { GenericError } from './Error/GenericError';
import { InvalidArgumentError } from './Error/InvalidArgumentError';
import { InvalidDataError } from './Error/InvalidDataError';
import { InvalidExecutionError } from './Error/InvalidExecutionError';
import { InvalidUserOperationError } from './Error/InvalidUserOperationError';
import { IOError } from './Error/IOError';
import { NetworkError } from './Error/NetworkError';
import { NotEmptyError } from './Error/NotEmptyError';
import { NotImplementedError } from './Error/NotImplementedError';
import { NotReadyError } from './Error/NotReadyError';
import { RequestError } from './Error/RequestError';
import { ShouldNeverHappenError } from './Error/ShouldNeverHappenError';

import { ITranslate } from './i18n/ITranslate';
import { Translate } from './i18n/Translate';
import { TranslateSet } from './i18n/TranslateSet';

import { CommandLine } from './IO/CommandLine/CommandLine';
import { CommandLineArgument } from './IO/CommandLine/CommandLineArgument';
import { CommandLineConfiguration } from './IO/CommandLine/CommandLineConfiguration';
import { ICommandLineConfiguration } from './IO/CommandLine/ICommandLineConfiguration';

import { FileSystemFields } from './IO/FileSystem/FileSystemFields';
import { FileSystemInfo } from './IO/FileSystem/FileSystemInfo';
import { FileSystemMonitoring } from './IO/FileSystem/FileSystemMonitoring';
import { HelperFileSystem } from './IO/FileSystem/HelperFileSystem';
import { IFileSystemFields } from './IO/FileSystem/IFileSystemFields';
import { IFileSystemInfo } from './IO/FileSystem/IFileSystemInfo';
import { IFileSystemMonitoringEventData } from './IO/FileSystem/IFileSystemMonitoringEventData';
import { IFindFileSystemInfoConfiguration } from './IO/FileSystem/IFindFileSystemInfoConfiguration';

import { HelperNodeJs } from './IO/NodeJS/HelperNodeJs';
import { IPackageJson } from './IO/NodeJS/IPackageJson';

import { HashJson } from './Json/HashJson';
import { JsonLoader } from './Json/JsonLoader';

import { ILogMessage } from './Log/ILogMessage';
import { ILogMessageAndData } from './Log/ILogMessageAndData';
import { ILogWriter } from './Log/ILogWriter';
import { Logger } from './Log/Logger';
import { LogLevel } from './Log/LogLevel';
import { LogWriter } from './Log/LogWriter';
import { LogWriterToConsole } from './Log/LogWriterToConsole';
import { LogWriterToFile } from './Log/LogWriterToFile';
import { LogWriterToPersistent } from './Log/LogWriterToPersistent';

import './Prototype/Array';
import './Prototype/Date';
import './Prototype/JSON';
import './Prototype/Number';
import './Prototype/String';

import { ConnectionState } from './Type/Connection/ConnectionState';
import { IConnection } from './Type/Connection/IConnection';
import { IConnectionState } from './Type/Connection/IConnectionState';

import { FiltersType } from './Type/Data/FiltersType';
import { FilterType } from './Type/Data/FilterType';
import { KeyValue } from './Type/Data/KeyValue';

import { ResultEvent } from './Type/Event/ResultEvent';

import { PrimitiveEmptyType } from './Type/Native/PrimitiveEmptyType';
import { PrimitiveEmptyTypeName } from './Type/Native/PrimitiveEmptyTypeName';
import { PrimitiveValueType } from './Type/Native/PrimitiveValueType';
import { PrimitiveValueTypeName } from './Type/Native/PrimitiveValueTypeName';

export {
  sha256,
  DispatchedMessage,
  IMessage,
  Message,
  MessageListener,
  MessageSubscription,
  DateTimeFormat,
  DateTimeFormatMask,
  HelperDate,
  HelperList,
  HelperNumeric,
  HelperObject,
  HelperText,
  IDateTimeFormat,
  INumericFormat,
  NumericFormat,
  WordGenerator,
  EmptyError,
  GenericError,
  InvalidArgumentError,
  InvalidDataError,
  InvalidExecutionError,
  InvalidUserOperationError,
  IOError,
  NetworkError,
  NotEmptyError,
  NotImplementedError,
  NotReadyError,
  RequestError,
  ShouldNeverHappenError,
  ITranslate,
  Translate,
  TranslateSet,
  CommandLine,
  CommandLineArgument,
  CommandLineConfiguration,
  ICommandLineConfiguration,
  FileSystemFields,
  FileSystemInfo,
  FileSystemMonitoring,
  HelperFileSystem,
  IFileSystemFields,
  IFileSystemInfo,
  IFileSystemMonitoringEventData,
  IFindFileSystemInfoConfiguration,
  HelperNodeJs,
  IPackageJson,
  HashJson,
  JsonLoader,
  ILogMessage,
  ILogMessageAndData,
  ILogWriter,
  Logger,
  LogLevel,
  LogWriter,
  LogWriterToConsole,
  LogWriterToFile,
  LogWriterToPersistent,
  ConnectionState,
  IConnection,
  IConnectionState,
  FiltersType,
  FilterType,
  KeyValue,
  ResultEvent,
  PrimitiveEmptyType,
  PrimitiveEmptyTypeName,
  PrimitiveValueType,
  PrimitiveValueTypeName
};
